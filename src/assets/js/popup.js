let currentPopup = { title: null, content: null, collectionIDs: null, callback: null, autoClose: null };

export const popup = (title, content, collectionIDs, callback = (r)=>{}, autoClose=true, customFinishName="Finish") => {
    let popup = document.getElementById('popup');
    currentPopup = { title, content, collectionIDs, callback, autoClose };
    popup.children[0].children[0].innerHTML = title;
    popup.children[0].children[1].innerHTML = content;
    popup.children[0].children[2].children[1].innerText = customFinishName;
    popup.classList.add('open');
}
export const closePopup = () => { document.getElementById('popup').classList.remove('open'); }
export const finishPopup = () => {
    if (currentPopup.collectionIDs !== null) {
        let results = [];
        for (let i=0; i<currentPopup.collectionIDs.length; i++) {
            let c = document.getElementById(currentPopup.collectionIDs[i].split('/')[0]);
            if (!c) { console.log('Collection ID '+i+' is null (for popup finish)\nID: '+currentPopup.collectionIDs[i]); return; }
            if (c.nodeName.toLowerCase() === 'input') {
                if (c.type === 'text' || c.type === 'email' || c.type === 'password') {
                    results.push(c.value);
                } else if (c.type === 'file') {
                    results.push(c.files[0]);
                } else {
                    console.log("could not parse input type "+c.type+" in popup.js")
                    results.push(c.value);
                }
            } else if (c.nodeName.toLowerCase() === 'textarea') {
                results.push(c.value);
            } else if (c.nodeName.toLowerCase() === 'p' || c.nodeName.toLowerCase() === 'span') {
                results.push(c.innerHTML);
            } else if (c.nodeName.toLowerCase() === 'div' && currentPopup.collectionIDs[i].includes('/')) {
                results.push(c.dataset[currentPopup.collectionIDs[i].split('/')[1]]);
            } else {
                console.log("could not parse node "+c.nodeName+" in popup.js")
                break;
            }
        }
        currentPopup.callback(results);
    }
    if (currentPopup.autoClose) {closePopup();}
}

export async function uploadFile(displayedAllowedFileTypes, allowedFileTypes, uploadIcon, callback =()=>{}) {
    let aftc = `<ul>`;
    for (let i=0; i<displayedAllowedFileTypes.length; i++) {
        aftc += `<li>.${displayedAllowedFileTypes[i]}</li>`;
    }
    aftc += `</ul>`;

    popup('Upload file', `
      Upload a file of one of the following types:${aftc}
      <div class='input file icon'>
        <img src="${uploadIcon}">
        <input type="file" id="fileuploadpopup-input" name="fileuploadpopup-input" accept="${allowedFileTypes}">
      </div>`, ['fileuploadpopup-input'], async (r)=>{
        console.log(r);
    });
}