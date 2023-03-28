// im not very good at js if there any problem in this code please tell me

if (typeof jsyaml === "undefined") {
    var element = document.createElement("script");
    element.setAttribute("src", "https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js");
    document.getElementsByTagName("body")[0].appendChild(element);
}


function append_cv_table_fromYAML(filename, elementid) {
    fetch(filename)
        .then(response => {
            if (response.ok)
                return response.text();
            else
                throw new Error('file not found');
        }
        ).then(yamlText => {
            let data = jsyaml.load(yamlText);
            createCvTable(document.getElementById(elementid), data);
        })
        .catch(error => console.error(error));
}

function append_cv_fromYAML(filename, div_id) {
    // append_cv_table_fromYAML(filename, table_div_id);
    fetch(filename).then(response => {
        if (response.ok)
            return response.text();
        else
            throw new Error('file not found');
    }).then(yamlText => {
        const data = jsyaml.load(yamlText);
        create_page_ofobject(data, div_id);
    }).catch(error => console.error(error));

}

function isObject_have_reqkeys(obj, reqkeys) {
    return reqkeys.every(item => (item in obj));
}



function insert_beforeend_ofArray(strData, arr) {
    const arrEnd = arr.pop();
    if (arrEnd == "undefined")
        return new Error(' array is not have start and end ');

    if (typeof (strData) == "string")
        arr.push(strData);
    else
        for (var i = 0; i < strData.length; i++) {
            arr.push(strData[i]);
        }
    arr.push(arrEnd);
}

function create_page_ofobject(data, div_id = "container") {
    // creates a div contains cv data
    // example one liner to be used

    // TODO make more moduler

    const toplvl_keys = new Array("basics", "education", "languages", "knowledge", "programming_languages");

    if (!isObject_have_reqkeys(data, toplvl_keys))
        return new Error('data does not have required keys');

    var containerElement = document.getElementById(div_id);

    if (containerElement == null) {
        var containerElement = document.createElement("div");
        containerElement.setAttribute("id", div_id);
        document.getElementsByTagName("body")[0].appendChild(containerElement);
    }

    var headerDiv = new Array('<div class="header" >', '</div>');
    insert_beforeend_ofArray(`<div class="full-name"> <span class="first-name"> ${data['basics']['first-name']} </span> <span class="last-name"> ${data['basics']['last-name']} </span> </div>`, headerDiv);
    const contact_info = Array(`
<div class="contact-info">
<span class="email"><i class="fa-solid fa-at"></i></span>
<span class="email-val">${data['basics']['email']} </span>`);

    const data_profiles = data['basics']['profiles'];

    var req_keys = Array('name', 'url', 'icon');
    for (var i = 0; i < data_profiles.length; i++) {
        if (isObject_have_reqkeys(data_profiles[i], req_keys)) {
            contact_info.push('<span class="separator"></span>');
            if (isObject_have_reqkeys(data_profiles[i], Array('desc')))
                contact_info.push(`<a href="${data_profiles[i]['url']}" class="icon"><i class="${data_profiles[i]['icon']}"></i> /${data_profiles[i]['desc']}</a>`);
            else
                contact_info.push(`<a href="${data_profiles[i]['url']}" class="icon"><i class="${data_profiles[i]['icon']}"></i> >${data_profiles[i]['name']}</a>`);
        }
    }
    contact_info.push('</div>');
    insert_beforeend_ofArray(contact_info, headerDiv);
    insert_beforeend_ofArray(
        `<div class="about">
<span class="position">${data['basics']['label']}</span>
<span class="desc">${data['basics']['desc']} </span>
</div>
`, headerDiv
    );

    var detailsDiv = new Array('<div class="details" >', '</div>');
    var def_detailSection = [
        '<div class="section">',
        '<div class="section__title">',
        'section_title',
        '</div>',
        '<div class="section__list">',
        'section_list',
        '</div>',
        '</div>',
    ];
    const template_section_item = Array(
        '', ''
    );
   // section order = Array('education', 'languages', 'knowledge', 'programming_languages', 'projects');
    var sections = [null,null,null,null,null,null];
    for (let section in data) {
        console.log(`i am creation html from section ${section}`);
        switch(section){
        case 'education':
                var sect_edu = def_detailSection.slice();
                sect_edu[2] = 'Education'
                var sect_list = Array();

                for (let e_ind in data['education'])
                {
                    sect_list.push('<div class="section__list-item">');

                sect_list.push('<div class="detail_left">');

                    sect_list.push(`<div class="name">
${data['education'][e_ind]['school']}
</div>`);
                    sect_list.push(`<div class="addr">
${data['education'][e_ind]['addr']}
</div>`);
                    sect_list.push(`<div class="duration">${data['education'][e_ind]['start']} - ${data['education'][e_ind]['end']} </div>`);
                sect_list.push('</div>');

                    sect_list.push('<div class="detail_right">');
                    sect_list.push(`<div class="name">${data['education'][e_ind]['major']} </div>`);
                    sect_list.push(`<div class="description"> <span style="color: var(--link-color)"> GPA </span> ${data['education'][e_ind]['gpa']} </div>`);
                    sect_list.push('</div>');
                sect_list.push('</div>');
                }
            sect_edu[5] = sect_list.join('');
            sections[0] = sect_edu.join('');
        case 'languages':
            var sect_langs = def_detailSection.slice();
            sect_langs[2] = 'languages'
            var sect_list = Array();
            for (l_ind in data['languages']) {
                sect_list.push('<div class="section__list-item">');
                sect_list.push('<div class="detail_left">');
                sect_list.push(`<div class="name">
${data['languages'][l_ind]['name']}
</div>`);
                sect_list.push('</div>');

                    sect_list.push('<div class="detail_right">');
 sect_list.push(`<div class="description">
${data['languages'][l_ind]['degree']}
</div>`);
                sect_list.push('</div>');
                sect_list.push('</div>');

            }
            sect_langs[5] = sect_list.join('');
            sections[1] = sect_langs.join('');

        case 'knowledge':
            var sect_knowl = def_detailSection.slice();
            sect_knowl[2] = 'knowledge'
            var sect_list = Array();
            var side_switch = true;
            for (k_ind in data['knowledge']) {

                if (side_switch){
                sect_list.push('<div class="section__list-item">');
                sect_list.push('<div class="detail_left">');
                }else{
                    sect_list.push('<div class="detail_right">');
                }
                sect_list.push(`<div class="name">${data['knowledge'][k_ind]['name']}</div>`);

                sect_list.push(`<div class="description"><p>${data['knowledge'][k_ind]['detail']}</p></div>`);

                if (! side_switch){
                sect_list.push('</div>');
                }
                sect_list.push('</div>');
                side_switch = ! side_switch;
            }
              if(sect_list.length %2 == 1)
                sect_list.push('</div>');

            sect_knowl[5] = sect_list.join('');
            sections[2] = sect_knowl.join('');
        case 'programming_languages':
            var sect_pl = def_detailSection.slice();
            sect_pl[2] = 'programming languages'
            var sect_list = Array();
            var pl_data = data['programming_languages'];
            for (pl_ind in pl_data) {

                sect_list.push('<div class="section__list-item">');
                sect_list.push('<div class="detail_left">');
                if ('icon_url' in pl_data[pl_ind]){
                    let p_ico = ['<div class="name">','<img class="lazyloaded" src="',pl_data[pl_ind]["icon_url"],'" alt="',pl_data[pl_ind]["name"],'"/></div>'];
                    for (pk in p_ico)
                    sect_list.push(p_ico[pk]);
                }
                else if ('name' in pl_data[pl_ind])
                sect_list.push(`<div class="name">
${pl_data[pl_ind]['name']}
</div>`);

//                 if ('known_libs' in pl_data[pl_ind])
//                  sect_list.push(`<div class="description"><p>
//  <span style="color: var(--link-color)"> > </span>
// ${pl_data[pl_ind]['known_libs']}</p></div>`);


                if ('lang_names' in pl_data[pl_ind]){
                    sect_list.push('<div class="description">');
                 for (lang_id in pl_data[pl_ind]['lang_names']){
sect_list.push(`<span style="color: var(--link-color)"> ${pl_data[pl_ind]['lang_names'][lang_id]}`);
                     if(lang_id != pl_data[pl_ind]['lang_names'].length - 1)
                         sect_list.push(', ');

    sect_list.push('</span>');
                 }
                    sect_list.push('</div>');
                }

                if ('os' in pl_data[pl_ind])
                sect_list.push(`<div class="description"><p>
 <span style="color: var(--link-color)"> os </span>
${pl_data[pl_ind]['os']}</p></div>`);

                if('detail' in pl_data[pl_ind])
                sect_list.push(`<div class="description"><p>
                ${pl_data[pl_ind]['detail']}</p></div>`);

                sect_list.push('</div>');

                sect_list.push('<div class="detail_right">');

                if ('level' in pl_data[pl_ind]){
                    let degree = pl_data[pl_ind]['level'];
                    for (var i = 0; i < degree; ++i)
                        sect_list.push(`<span class="dot"></span>`);
                }

                sect_list.push('</div>');

                sect_list.push('</div>');
            }
              console.log(sect_list);
            sect_pl[5] = sect_list.join('');
            sections[3] = sect_pl.join('');
        case 'projects':
            var sect_proj = def_detailSection.slice();
            sect_proj[2] = 'projects'
            var sect_list = Array();
            var side_switch = true;
            for (p_ind in data['projects']) {

                if (side_switch){
                sect_list.push('<div class="section__list-item">');
                sect_list.push('<div class="detail_left">');
                }else{
                    sect_list.push('<div class="detail_right">');
                }
                sect_list.push(`<div class="name"> <a href="${data['projects'][p_ind]['url']}" >${data['projects'][p_ind]['name']} </a></div>`);

                sect_list.push(`<div class="description"><p>${data['projects'][p_ind]['description']}</p></div>`);

                if (! side_switch){
                sect_list.push('</div>');
                }
                sect_list.push('</div>');
                side_switch = ! side_switch;
            }
              if(sect_list.length %2 == 1)
                sect_list.push('</div>');

            sect_proj[5] = sect_list.join('');
            sections[4] = sect_proj.join('');

        }

    }


    insert_beforeend_ofArray(sections,detailsDiv);
    // insert_beforeend_ofArray(
    //   ```
    //   < div class="about" ></div >
    //     ```, headerDiv);
    // insert_beforeend_ofArray(```
    //       ```, headerDiv);
    var headerDiv = headerDiv.join('');
    containerElement.insertAdjacentHTML('beforeend', headerDiv);
    var detailsDiv = detailsDiv.join('');
    containerElement.insertAdjacentHTML('beforeend', detailsDiv);
}
