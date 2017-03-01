// Test branch
var fs = require('fs');
var path = require('path')
var readline = require('readline');
var questions = ['Enter Folder path?',
    'Enter renaming file extention?',
    'Want to rename subfile also?(yes/no)'
];
var rl = readline.createInterface(process.stdin, process.stdout);
var answers = [];
rl.question(questions[0], function(answer) {
    answers.push(answer);
    rl.setPrompt(questions[1]);
    rl.prompt();
    rl.on('line', function(ans) {
        answers.push(ans.trim());
        if (answers.length >= questions.length) {
            rl.close();
        } else {
            rl.setPrompt(questions[2]);
            rl.prompt()
        }
    });
});

rl.on('close', function() {
    var isrename = answers[2].toLowerCase() == 'yes' ? true : false;
    readdirectory(answers[0], 0, isrename, answers[1]);
});

var index = 0;
function readdirectory(direname, index, isrename, extn) {
    console.log(direname);
    extn = extn.replace('.', '');
    fs.readdir(direname, function(err, args) {
        index++;
        args.forEach(function(element, key) {
            stats = fs.lstatSync(direname + '/' + element);
            var fldname = path.basename(direname);
            var filename = path.basename(element, path.extname(element));
            if (stats.isDirectory()) {
                readdirectory(path.join(direname, element), index, true, extn);
            } else if (isrename && path.extname(element) == '.' + extn && filename.indexOf(fldname) < 0) {
                fs.rename(path.join(direname, element), path.join(direname, fldname.replace(' ', '') + '-' + filename.trim() + path.extname(element)), function(err) {
                    console.log('\n File renamed');
                    //process.exit();
                });
            } else {
                console.log(element, '  Already in same name  ', extn, filename.indexOf(fldname))
            }
        });
        // process.exit();
    });

}