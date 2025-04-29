#!/bin/bash

# Проверка на наличие аргумента (цифры)
if [ $# -eq 0 ]; then
    echo "Ошибка: Необходимо указать число в качестве аргумента."
    exit 1
fi

# Сохранение текущей директории
original_dir=$(pwd)

# Сборка Docker образа
docker build . -t verondel/yoga_client:1.$1

# Загрузка образа на Docker Hub
docker push verondel/yoga_client:1.$1
