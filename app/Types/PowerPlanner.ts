export namespace NPowerPlanner {
  /**
   * Структура датафайла приложения планировщика энергосистемы
   */
  export interface IDatafile {
    /**
     * Список генераторов, производящих энергию
     */
    generators: IGenerator[]

    /**
     * Словарь потредняемых видов топлива
     */
    fuels: IFuel[]

    /**
     * Словарь компонентов, используемых при постройке
     */
    components: IComponent[]

    /**
     * FG класс компонента воды
     */
    waterClass: string

    /**
     * FG класс энергомодуля
     */
    powerShardClass: string
  }

  /**
   * Описание генератора
   */
  export interface IGenerator {
    /**
     * Название
     */
    name: string

    /**
     * FG класс
     */
    class: string

    /**
     * Имя файла иконки
     */
    icon: string

    /**
     * Базовая мощность
     */
    power: number

    /**
     * Список компонентов для постройки
     */
    blueprint: IBlueprintItem[]

    /**
     * Базовое потребление воды
     */
    waterConsumption: number

    /**
     * Список имен FG классов топлива
     */
    fuels: IFuel['class'][]
  }

  /**
   * Описание топлива
   */
  export interface IFuel {
    /**
     * Название
     */
    name: string

    /**
     * FG класс
     */
    class: string

    /**
     * Имя файла иконки
     */
    icon: string

    /**
     * Запас энергии
     */
    energy: number
  }

  /**
   * Описание компонентов (для стоимости постройки)
   */
  export interface IComponent {
    /**
     * Название
     */
    name: string

    /**
     * FG класс
     */
    class: string

    /**
     * Имя файла иконки
     */
    icon: string
  }

  /**
   * Описание компонента для постройки
   */
  export interface IBlueprintItem {
    /**
     * FG класс компонента
     */
    component: IComponent['class']

    /**
     * Количество компонента
     */
    amount: number
  }
}
