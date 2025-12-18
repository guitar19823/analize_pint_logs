import { ITree, RowType } from "./types";

export const tableTree: ITree = {
  root: [
    {
      cells: [
        "Заголовок 1",
        "Заголовок 2",
        "Заголовок 3",
        "Заголовок 4",
        "Заголовок 5",
        "Заголовок 6",
        "Заголовок 7",
        "Заголовок 8",
        "Заголовок 9",
        "Заголовок 10",
      ],
      param: {
        id: 0,
        isExpanded: false,
        type: RowType.HEADER,
      },
    },
    {
      cells: ["Раздел 1", "", "", "", "", "", "", "", "", ""],
      children: [
        {
          cells: [
            "Подраздел 1.1",
            "Д.1",
            "Д.2",
            "Д.3",
            "Д.4",
            "Д.5",
            "Д.6",
            "Д.7",
            "Д.8",
            "Д.9",
          ],
          children: [
            {
              cells: [
                "Группа 1.1.1",
                "Зн.1",
                "Зн.2",
                "Зн.3",
                "Зн.4",
                "Зн.5",
                "Зн.6",
                "Зн.7",
                "Зн.8",
                "Зн.9",
              ],
              children: [
                {
                  cells: [
                    "Элемент 1.1.1.1",
                    "В1",
                    "В2",
                    "В3",
                    "В4",
                    "В5",
                    "В6",
                    "В7",
                    "В8",
                    "В9",
                  ],
                  children: [
                    {
                      cells: [
                        "Вложенный 1.1.1.1.1",
                        "У5-1",
                        "У5-2",
                        "У5-3",
                        "У5-4",
                        "У5-5",
                        "У5-6",
                        "У5-7",
                        "У5-8",
                        "У5-9",
                      ],
                      children: [
                        {
                          cells: [
                            "Уровень 6.1",
                            "6-1",
                            "6-2",
                            "6-3",
                            "6-4",
                            "6-5",
                            "6-6",
                            "6-7",
                            "6-8",
                            "6-9",
                          ],
                          children: [
                            {
                              cells: [
                                "Глубокий элемент (глубина 7)",
                                "7-1",
                                "7-2",
                                "7-3",
                                "7-4",
                                "7-5",
                                "7-6",
                                "7-7",
                                "7-8",
                                "7-9",
                              ],
                              param: {
                                id: 7,
                                isExpanded: false,
                                type: RowType.BODY,
                              },
                            },
                          ],
                          param: {
                            id: 6,
                            isExpanded: false,
                            type: RowType.BODY,
                          },
                        },
                      ],
                      param: {
                        id: 5,
                        isExpanded: false,
                        type: RowType.BODY,
                      },
                    },
                  ],
                  param: {
                    id: 4,
                    isExpanded: false,
                    type: RowType.BODY,
                  },
                },
              ],
              param: {
                id: 3,
                isExpanded: false,
                type: RowType.BODY,
              },
            },
          ],
          param: {
            id: 2,
            isExpanded: false,
            type: RowType.BODY,
          },
        },
      ],
      param: {
        id: 1,
        isExpanded: false,
        type: RowType.BODY,
      },
    },
    {
      cells: ["Раздел 2", "", "", "", "", "", "", "", "", ""],
      children: [
        {
          cells: [
            "Подраздел 2.1",
            "X1",
            "X2",
            "X3",
            "X4",
            "X5",
            "X6",
            "X7",
            "X8",
            "X9",
          ],
          children: [
            {
              cells: [
                "Группа 2.1.1",
                "Y1",
                "Y2",
                "Y3",
                "Y4",
                "Y5",
                "Y6",
                "Y7",
                "Y8",
                "Y9",
              ],
              param: {
                id: 10,
                isExpanded: false,
                type: RowType.BODY,
              },
            },
          ],
          param: {
            id: 9,
            isExpanded: false,
            type: RowType.BODY,
          },
        },
      ],
      param: {
        id: 8,
        isExpanded: false,
        type: RowType.BODY,
      },
    },
    {
      cells: [
        "Итого",
        "Сумма 1",
        "Сумма 2",
        "Сумма 3",
        "Сумма 4",
        "Сумма 5",
        "Среднее 1",
        "Среднее 2",
        "Среднее 3",
        "Среднее 4",
      ],
      param: {
        id: 11,
        isExpanded: false,
        type: RowType.FOOTER,
      },
    },
  ],
};
