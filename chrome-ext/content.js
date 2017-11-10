var products = document.getElementsByClassName('product-item__name');
var indexes = {};
for (var i = 0, l = products.length; i < l; i++) {
    var productNode = products[i].children[0];
    if(productNode !== undefined){
        indexes[productNode.textContent] = i;
        fetch(encodeURI(`https://untappd-proxy.herokuapp.com/untappd?productName=${productNode.textContent}&index+${i}`))
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                    return;
                }

                response.json().then(function(data) {
                    var parent = products[indexes[data.vinmonopolet_name]].parentNode.parentNode.parentNode.children[1];
                    var newDiv = document.createElement("div");
                    newDiv.classList.add('untappd');
                    var bryggeri = document.createElement("div");
                    var navn = document.createElement("div");
                    var rating = document.createElement("div");
                    var untappd = document.createElement("div");
                    bryggeri.appendChild(document.createTextNode(`${data.brewery.brewery_name}`));
                    navn.appendChild(document.createTextNode(`${data.beer_name}`));
                    rating.appendChild(document.createTextNode(`Rating: ${data.rating_score}`));
                    untappd.appendChild(document.createTextNode(`UNTAPPD`));
                    newDiv.appendChild(untappd);
                    newDiv.appendChild(bryggeri);
                    newDiv.appendChild(navn);
                    newDiv.appendChild(rating);
                    parent.appendChild(newDiv);
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    }
}
