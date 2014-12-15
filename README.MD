<h2> Описание </h2>
Небольшой календарь. Сервер написан на ноде. Реализованный функционал:
<ol>
    <li>Creating event with Click</li>
    <li>Opening event with Doubleclick</li>
    <li>Create event with Drag And Drop</li>
    <li>Deleting event</li>
    <li>Closing modal on escape</li>
    <li>Moving event</li>
    <li>Changing current day with arrows</li>
    <li>Change day in date picker</li>
    <li>Change year or month in date picker</li>
    <li>Form validation</li>
</ol>


Используемые JavaScript библиотеки:
<ol> 
    <li>AngularJs</li>
    <li>lodash</li>
    <li>momentJs</li>
    <li>jQuery</li>
    <li>Jasmine</li>
</ol>

Для сборки проекта требуются установленные:
<ol>
    <li><a href="http://nodejs.org/">NodeJs</a></li>
    <li><a href="http://gruntjs.com/">Grunt</a></li>
    <li><a href="http://git-scm.com/">Git</a></li>
    <li><a href="https://www.ruby-lang.org/">Ruby</a></li>
    <li><a href="http://sass-lang.com/">Sass</a></li>
</ol>

Запуск проекта:
<ol>
    <li><code>npm install</code> - установка зависимостей</li>
    <li><code>grunt build</code> - билд проекта</li>
    <li><code>node start build/back-end/app.js</code> - запуск сервера</li>
</ol>

Настроенные grunt таски:
<ol>
    <li><code>grunt build</code>:</li>
    <ol>
        <li>Запуск статического анализатора <a href="http://jshint.com/">JSHint</a> </li>
        <li>Конкантенация javascript файлов в один</li>
        <li>Аннотирование получившегося файла с помощью <a href="https://www.npmjs.org/package/ng-annotate">ng-annotate</a> (нужно, что бы после минификации DI ангулярки не сломался)</li>
        <li>Минификация получившегося файла с помощью <a href="https://github.com/mishoo/UglifyJS">UglifyJS</a></li>
        <li>Компиляция стилей с помощью <a href="http://sass-lang.com/">sass</a></li>
        <li>Добавление вендорных префиксов в css с помощью <a href="https://github.com/postcss/autoprefixer">autoprefixer</a></li>
        <li>Минификация css с помощью <a href="https://github.com/jakubpawlowicz/clean-css">clean-css</a></li>
        <li>Считается хэш получившехся файлов и если он изменился, то переименовываем их (что бы браузер не использовал кэшированные версии)</li>
        <li>Меняем на index.html все ссылки на получившиеся в результате билда файлы</li>
        <li>Минифицируется index.html с помощью <a href="https://github.com/kangax/html-minifier">html-minifier</a></li>
    </ol>
    <li><code>grunt developing</code></li>
    <ol>
        <li>Стартует нода на 9000 порту</li>
        <li>При измении html/js файлов происходит автоматическая перезагрузка страницы в браузере</li>
        <li>При изменении scss происходит перекомпиляция и автоматическая перезагрузка страницы в браузере</li>
        <li>При изменеии backend кода происходит рестарт ноды</li>
    </ol>
    <li><code>grunt test</code></li>
    <ol>
        <li>Запуск тестов, после этого в дирректории coverage сформируется отчет о покрытии кода тестами</li>
    </ol>
</ol>

Работает корректно во всех последних браузерах.