document.addEventListener("DOMContentLoaded", function() {
    loadPostcards();
});

function loadPostcards(){
    $('#emptyContainer').hide();
    $.ajax({
        type: "GET",
        url: "php/load-cards.php",
        data: {},
        success: function(response){
            if(response=='0'){
                $('#postcardContainer').hide();
                $('#emptyContainer').show();
            }
            else{
                $.each(response, function(index, obj) {
                    const postcardContainer = document.getElementById('postcardContainer');
                    const colDiv = document.createElement('div');
                    colDiv.className = 'col';

                    const cardDiv = document.createElement('div');
                    cardDiv.className = 'card h-100 py-3 px-xl-4 shadow';

                    // image (postcard)
                    const imgElement = document.createElement('img');
                    imgElement.src = obj.processed_url;
                    imgElement.className = 'card-img-top img-fluid card-img';
                    imgElement.addEventListener('click', () => {
                        postcardDetails(
                            obj.title,
                            obj.editor_content,
                            obj.region_name,
                            obj.temperature,
                            obj.weather_icon_url,
                            obj.weather_description,
                            obj.date_posted.date.split(" ")[0]
                        );
                    });
                    // card body
                    const cardBodyDiv = document.createElement('div');
                    cardBodyDiv.className = 'card-body';

                    // card title
                    const cardTitle = document.createElement('h5');
                    cardTitle.className = 'card-title';
                    cardTitle.textContent = obj.title;

                    // date posted
                    const smallText = document.createElement('small');
                    smallText.className = 'card-text text-muted';
                    // smallText.textContent = obj.date_posted.date.split(' ')[0];

                    // postcard text (show only 50 characters)
                    const cardText = document.createElement('p');
                    cardText.className = 'card-text mt-2';
                    if(obj.description.length > 50){
                        cardText.textContent = obj.description.substring(0,50) + '...';
                    }
                    else{
                        cardText.textContent = obj.description;
                    }

                    // weather part
                    const weatherDiv = document.createElement('div');
                    const weatherIcon = document.createElement('img');
                    weatherIcon.src = obj.weather_icon_url;
                    weatherIcon.width = 40;
                    weatherIcon.height = 40;
                    weatherIcon.className = 'weatherIcon';

                    // weather label, temp, and region where the postcard was created
                    const weatherLabel = document.createElement('label');
                    weatherLabel.className = 'ms-2 text-muted';
                    weatherLabel.textContent = obj.weather_description + ' / ' + obj.temperature + '°C / ' + obj.region_name;
                    weatherDiv.appendChild(weatherIcon);
                    weatherDiv.appendChild(weatherLabel);

                    // button for checking postcard details
                    const button = document.createElement('button');
                    button.className = 'btn-style mt-4';
                    button.type = 'button';
                    button.textContent = 'View';
                    button.onclick = () => postcardDetails(obj.title, obj.editor_content, obj.region_name, obj.temperature, obj.weather_icon_url, obj.weather_description, obj.date_posted.date.split(' ')[0]);

                    // append all elements to the card body
                    cardBodyDiv.appendChild(cardTitle);
                    cardBodyDiv.appendChild(smallText);
                    cardBodyDiv.appendChild(cardText);
                    cardBodyDiv.appendChild(weatherDiv);
                    cardBodyDiv.appendChild(button);

                    // append card body and image to the main card div
                    cardDiv.appendChild(imgElement);
                    cardDiv.appendChild(cardBodyDiv);

                    // append main card div to the column
                    colDiv.appendChild(cardDiv);

                    postcardContainer.appendChild(colDiv);
                });
                $('#postcardContainer').show();
                $('#emptyContainer').hide();
            }
        },
        error: function(data) {
            console.log("AJAX error: ", data);
            alert('There seems to be a connection problem. Please try again.');
        }
    });
}

function postcardDetails (title, content, regionName, temperature, weatherIconURL, weatherDescription, datePosted) {
    if (FroalaEditor.INSTANCES.length > 0) {
        FroalaEditor.INSTANCES.forEach(instance => instance.destroy());
    }

    $('#postcardTitle').html(title);
    //$('#datePosted').html(datePosted);
    $('#weatherDetails').html(
        '<img src="' + weatherIconURL + '\" class="weatherIcon" height="40px" width="40px" /> <label class="ms-2 text-muted">' + weatherDescription + ' / ' + temperature + '°C / ' + regionName + '</label>'
    );

    new FroalaEditor('#loaded-froala-editor',{
        events: {
            'initialized': function () {
                this.html.set(content);
                this.toolbar.hide();
            }
        }
    });
    $('#detailsModal').modal('show');
}