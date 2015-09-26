/*
  Gruntfile.js

  Функции: Автоматическое подключение задач (load-grunt-tasks),
           Компиляция sass,
           Авто добавление вендорных префиксов,
           оптимизация media query,
           "Причесывание" style.css,
           Очистка конечной папки проекта,
           Копирование файлов в конечную папку проекта,
           Отслеживание изменений файлов scss,
           "Склеивание" скриптов,
           Минификация скриптов,
           Минификация стилей

  Структура проекта: /Project
                       |----/build
                       |----/src
                            |----/js
                            |----/fonts
                            |----/img
                            |----/scss
                            |----style.css
                            |----*.html
*/
module.exports  = function(grunt){

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({

    // Компиляция sass
    sass: {
      dist: {
        options: {
          style: "expaned"
        },
        files: {
          "src/style.css": "src/scss/style.scss"
        }
      }
    },

    // Добавление вендорных префиксов
    autoprefixer: {
      options: {
        browser: ["last 3 version", "ie8", "ie9"]
      },
      files: {
        src: "src/style.css"
      }
    },

    // Сборка все media query's и помещение их в самый конец style.css файла
    cmq: {
      style: {
        options: {
          log: false
        },
        files: {
          "src/style.css": ["src/style.css"]
        }
      }
    },

    // Сжимание и минификация style.css файла
    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0,
          report: "gzip"
        },
        files: {
          "build/style.min.css": ["build/style.css"]
        }
      }
    },

    // Привести в порядок файл style.css к единому стилю кода
    csscomb: {
      style: {
        expand: true,
        src: ["build/style.css"]
      }
    },

    // Очищаем конечную папку build перед копированием
    clean: {
      build: ["build"]
    },

    // Копируем нужные файлы в папку build
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: "src",
          src: [
            "img/**",
            "fonts/**",
            "**/*.html",
            "style.css"
          ],
          dest: "build"
        }]
      }
    },

    // Склеиваем скрипты js
    concat: {
      dist: {
        src: ["src/js/**/*.js"],
        dest: ["build/js/build.js"]
      }
    },

    // Минификация файла build.js
    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: "some"
      },
      dist: {
        src: ["build/build.js"],
        dest: ["build/build.min.js"]
      }
    },

    // Смотрим за изменениями файлов *.scss и выполняем авто-компиляция при изменении
    watch: {
      style: {
        files: ["src/**/*.scss"],
        tasks: ["sass", "autoprefixer"],
        options: {
          spawn: false,
        }
      }
    }

  });

  // Задача для разработки
  grunt.registerTask("dev", [
    "watch"
  ]);

  // Задача для сборки и оптимизации готового проекта
  grunt.registerTask("prod", [
    "sass",
    "autoprefixer",
    "cmq",
    "clean",
    "copy",
    "csscomb",
    "cssmin",
    "concat",
    "uglify"
  ]);

};