export namespace PowerPlanner {
  /**
   * Структура датафайла приложения планировщика энергосистемы
   */
  export interface Datafile {
    /**
     * Список генераторов, производящих энергию
     */
    generators: Generator[]

    /**
     * Словарь потредняемых видов топлива
     */
    fuels: Fuel[]

    /**
     * Словарь компонентов, используемых при постройке
     */
    components: Component[]

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
  export interface Generator {
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
    blueprint: BlueprintItem[]

    /**
     * Базовое потребление воды
     */
    waterConsumption: number

    /**
     * Список имен FG классов топлива
     */
    fuels: Fuel['class'][]
  }

  /**
   * Описание топлива
   */
  export interface Fuel {
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
  export interface Component {
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
  export interface BlueprintItem {
    /**
     * FG класс компонента
     */
    component: Component['class']

    /**
     * Количество компонента
     */
    amount: number
  }
}
