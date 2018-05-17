function newRegistrar(renderFun, input, output) {
    return function() {
        $(input).change(function() {
            renderFun(this.files[0], output)
        });
    };
}

function commonRegistrar(input, output) {
    return newRegistrar(renderCommon, input, output);
}

function renderCytoscape(file, output) {
    var reader = new FileReader();

    reader.onload = function(event) {
    var str = event.target.result;
        try {
            var json = JSON.parse(str);
        } catch(err) {
            alert('Invalid json');
            return;
        }

        var cy = cytoscape({
            container: $(output),
            elements: json,
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#678',
                        'label': 'data(id)',
                        'width': 5,
                        'height': 5,
                        'font-size': 6
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 1,
                        'line-color': '#cde',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ],
            layout: {name: 'cose'}
        });
        //cy.layout({name: 'cose'}).run();

    };

    reader.readAsText(file);
}

function renderCommon(file, output) {
    var reader = new FileReader();
    reader.file = file;

    var read = reader.readAsDataURL;
    var renderer = renderBase64;

    if (file.type === "application/json") {
        read = reader.readAsText;
        renderer = renderJson;
    } else if (file.type.startsWith("text/")) {
        read = reader.readAsText;
        renderer = renderText;
    } else if (file.type.startsWith("image/")) {
        renderer = renderImage;
    }

    reader.onload = renderer.bind(reader, output);
    read.call(reader, file);
}

function renderBase64(output, event) {
    var payload = this.result.replace('data:' + this.file.type + ';base64,', '')
    var decoded = window.atob(payload);
    $(output).html("<pre>" + decoded + "</pre>")
}

function renderImage(output, event) {
    var base64 = event.target.result
    $(output).html("<img src=\"" + base64 + "\"/>")
}

function renderText(output, event) {
    var str = event.target.result
    $(output).html("<pre>" + str + "</pre>");
}

function renderJson(output, event) {
    var str = event.target.result;
    try {
        var json = JSON.parse(str);
    } catch(err) {
        alert('Invalid json');
        return;
    }

    $(output).html("<pre>" + str + "</pre>");
}
