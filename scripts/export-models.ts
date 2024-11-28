import chalk from 'chalk'
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'
import { parse } from 'yaml'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { ZodType } from 'zod'

const targetModelFiles = ['error', 'input', 'output', 'query-string']

const modelScopes: Record<string, string[]> = {}
const exportedModels: string[] = []
const modelFolder = join(__dirname, '..', 'models')

mkdirSync(modelFolder, { recursive: true })

function exportModel(t: ZodType<unknown>, name: string, className: string) {
    console.log(className)
    const { definitions } = zodToJsonSchema(t, { name, $refStrategy: 'none' })
    const modelFilename = join(modelFolder, `${name}.json`)
    const modelFileContent = JSON.stringify(definitions?.[name], undefined, 2)
    writeFileSync(modelFilename, modelFileContent)
    exportedModels.push(name)
    console.info(chalk.greenBright(`${name} is exported by ${className}.`))
}

const classFolder = join(__dirname, '..', 'classes')
const classNames = readdirSync(classFolder)
for (const className of classNames) {
    const templateFile = join(classFolder, className, 'template.yml')
    if (!existsSync(templateFile)) continue

    const template = parse(readFileSync(templateFile, 'utf-8'))
    if (!template?.methods || !template.methods.length) throw new Error('No methods found in template.yml')

    // * detect used models
    const usedModels: string[] = []
    if (template.init?.errorModel && !usedModels.includes(template.init.errorModel)) usedModels.push(template.init.errorModel)
    if (template.init?.inputModel && !usedModels.includes(template.init.inputModel)) usedModels.push(template.init.inputModel)
    if (template.init?.outputModel && !usedModels.includes(template.init.outputModel)) usedModels.push(template.init.outputModel)
    if (template.init?.queryStringModel && !usedModels.includes(template.init.queryStringModel)) usedModels.push(template.init.queryStringModel)
    for (const method of template.methods) {
        if (method.errorModel && !usedModels.includes(method.errorModel)) usedModels.push(method.errorModel)
        if (method.inputModel && !usedModels.includes(method.inputModel)) usedModels.push(method.inputModel)
        if (method.outputModel && !usedModels.includes(method.outputModel)) usedModels.push(method.outputModel)
        if (method.queryStringModel && !usedModels.includes(method.queryStringModel)) usedModels.push(method.queryStringModel)
    }

    const modelsFolder = join(classFolder, className, 'models')
    for (const targetModelFile of targetModelFiles) {
        const modelPath = join(modelsFolder, `${targetModelFile}.ts`)
        console.log(modelPath)
        if (existsSync(modelPath)) {
            // @ts-ignore
            const models = require(modelPath)
            for (const model of Object.keys(models)) {
                console.log(model)
                if (usedModels.includes(model)) {
                    if (!modelScopes[model]) modelScopes[model] = []
                    if (!modelScopes[model].includes(className)) modelScopes[model].push(className)

                    if (!exportedModels.includes(model)) exportModel(models[model], model, className)
                    else console.warn(chalk.greenBright(`${model} is already exported by ${modelScopes[model][0]}.`))
                } else console.warn(chalk.redBright(`${model} is not used in ${className} scope.`))
            }
        }
    }
}

const existingModels = readdirSync(modelFolder)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
for (const modelName of existingModels.filter((m) => !exportedModels.includes(m))) {
    const modelPath = join(modelFolder, `${modelName}.json`)
    console.info(chalk.blueBright(`Removing unused model ${modelName}.`))
    unlinkSync(modelPath)
}
