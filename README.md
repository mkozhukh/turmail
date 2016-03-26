TurMail - Mail templating for transactional email
-------------------------------------------------

### How to install

```js
npm install turmail
```

### How to use

```js
var mail = require("turmail");
mail.init({
    domain:"your.domain.com",
    key:"your mailgun key",
    path:"./templates" //path to templates folder
});

mail.send("RestorePassword", { to:"some@gmail.com" });
//or
mail.send("RestorePassword", { 
  to:"some@gmail.com",
  subject:"My email",
  from:"best.support@gmail.com",
  name:"Mike",
  link:"http://some.com/restore/2323221as"
});
```


### Templates 

There are two kinds of templates 

- envelopes - HTML makets for emails
- letter - yaml config objects for emails

When you are sending email, the script will locate YAML configuration file in `emails` folder. From YAML file, it will take `envelope` property and will read the related envelope file. After that script will fill the envelope template with parameters from the YAML file and parameters from the send command.


#### Example

When you call 

```js
mail.send("RestorePassword", { 
    to:"some@gmail.com ",

    //data to fill the template
    project:"Cool Project",
    name:"Maksim",
    password:"some"
})
```

script will read templates/letters/RestorePassword.yaml file. 

```yaml
from: some@ya.ru
envelope: NiceLetter
subject: Restore password for {{project}}
body: Hi {{name}}. Here is your new key {{key}}
```

After that, it will read templates/envelopes/NiceLetter.html 

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
    {{{body}}}
</body>
</html>
```

Now, the script will fill all placeholder in NiceLetter.html with parameters from RestorePassword.yaml, and will fill the result template with data from the second parameter of the send command. And as a final step, email to a recipient will be sent. 

If second parameter of the send command doesn't contain `from` and `subject` keys, those fields will be taken from the YAML file.



### License

The MIT License (MIT)
Copyright (c) 2016 Maksim Kozhukh

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.