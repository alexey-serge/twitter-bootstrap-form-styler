Form Styler for Bootstrap
=============================
Стилизация форм в [Twitter Bootstrap](http://twitter.github.com/bootstrap)

<img src="https://github.com/MamayAlexander/twitter-bootstrap-form-styler/raw/master/screenshot.png" alt="Preview" />

Стилизация

`<select>`
`<input type="checkbox">`
`<input type="radio">`
`<input type="file">`

Инструкция
-----------

1. Извлечь архив в папку с Twitter Bootstrap
2. Добавить строку @import "form-styler.less"; в конец файла bootstrap.less
3. Скомпилировать bootstrap.less
4. Подключить js скрипты

```
<script src="js/jquery.formstyler.js"></script>
<script>
  (function($) {
    $(function() {
      $('input, select').styler();
    })
  })(jQuery)
</script>
```

[Demo](http://alexander.mamay.su/twitter-bootstrap-form-styler/)

За основу взят [Form Styler by Dimox](http://dimox.name/jquery-form-styler/)