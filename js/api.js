

const dataBlock = document.querySelector("#dataBlock");
const form = document.querySelector("#covidDataForm");
const formInput = document.querySelector("#searchBoxInput");
const clearResults = () => dataBlock.innerHTML = "";

form.addEventListener('submit', e => {

    e.preventDefault();

    clearResults();

    console.log("form eventlistener fired");

    const q = formInput.value.trim(); // searched query

    const apiKey = "";   // insert API key here...

    const baseURL = "https://www.googleapis.com/youtube/v3";

    const fullURL = `${baseURL}/search?key=${apiKey}&q=${q}&part=snippet%2Cid&regionCode=IN&maxResults=5&order=viewCount&type=video&videoEmbeddable=true`;

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const extractArrayData = (array) => {

        return array.map(videoObj => {

            const { id: { videoId }, snippet: { title, channelTitle, thumbnails: { default: defultImg, medium: { url }, high } } } = videoObj;

            // required data
            return {
                videoId: videoId,
                title: title,
                channelTitle: channelTitle,
                thumbnail: url
            }
        });
    }

    // <li></li>
    const listItemtemplate = `
        <li class='result__li'>
            <img class='result__thumbnail' alt='thumbnail image not found'>
            <div class='result__righBody'>
                <h2 class='result__videoTitle'></h2>
                <h4 class='result__channelTitle'></h4>
                <button class='result__showVideoBtn buttonBaseStyle'>
                    <a class='result__videoLink text-white' target="_blank">Show Video</a>
                </button>
            </div> 
        </li>`;

    const $ = (...allClasses) => allClasses.map(myClass => document.querySelectorAll(myClass));

    const dataMapping = (data, parentELe) => {

        // mapping starts
        data.forEach((dataObj, index) => {

            // data
            const { videoId, title, channelTitle, thumbnail } = dataObj;

            parentELe.innerHTML += listItemtemplate;

            // calling $() to get updated elements by passing n classes
            const elementsArray = $(".result__videoLink", ".result__videoTitle", ".result__channelTitle", ".result__thumbnail");

            // getting updated array elements
            const [videoLinkArr, videoTitleArr, channelTitleArr, thumbnailArr] = elementsArray;

            // setting value
            videoLinkArr[index].href = `https://www.youtube.com/watch?v=${videoId}`;
            videoTitleArr[index].innerHTML = title;
            channelTitleArr[index].innerHTML = channelTitle;
            thumbnailArr[index].src = thumbnail;
        });
    }

    (async () => {
        try {
            const httpResponse = await fetch(fullURL, requestOptions);
            const data = await httpResponse.json();
            const { items } = data;
            const requiredData = extractArrayData(items);
            dataMapping(requiredData, dataBlock);
        } catch (error) {
            console.log(`Some error occured: ${error}`);
        }
    })();
});