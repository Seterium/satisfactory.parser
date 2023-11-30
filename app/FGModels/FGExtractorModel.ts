import { FGAbstractModel } from 'App/FGModels'

export class FGExtractorModel extends FGAbstractModel {
  async save() {
    console.log(`save ${this.constructor.name}`)
  }

  static async parseDocsJson() {
    const jsonDataList = this.getDocsJsonDescriptors([
      //
    ])

    for (const jsonData of jsonDataList) {
      const model = new this(jsonData)

      await model.save()
    }
  }
}
