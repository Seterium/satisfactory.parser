export function parseRecipeString(recipeString: string) {
  return recipeString.split('),').map((part) => {
    const [itemClass, amount] = part.replace(/\(|\)/g, '').split(',')

    if (itemClass === undefined) {
      throw new Error('Error in parseRecipeIngredients: itemClass is undefined')
    }

    const parsedItemClass = itemClass?.split('.')?.pop()?.replace(/"|'/g, '')

    if (parsedItemClass === undefined) {
      throw new Error('Error in parseRecipeIngredients: parsedItemClass is undefined')
    }

    if (amount === undefined) {
      throw new Error('Error in parseRecipeIngredients: amount is undefined')
    }

    const parsedAmount = parseInt(amount?.split('=')?.pop() ?? '0', 10)

    return {
      item: parsedItemClass,
      amount: parsedAmount,
    }
  })
}
