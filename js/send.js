
function changePostDisabled(e) {
    document.querySelector('#wordcount').innerText = e.value.length
    if (e.value != '' && document.querySelector('#bcc-input').value != '') {
        document.querySelector('#post-button').disabled = false
    } else {
        document.querySelector('#post-button').disabled = true
    }
}

async function post(text) {

    var users = document.querySelector('#bcc-input').value.split(' ')
    
    if (accounts[0].type == 'misskey') {

        var url = 'https://'+accounts[0].host+'/api/notes/create'

        for await (us of users) {

            var searchUrl = 'https://'+accounts[0].host+'/api/users/search-by-username-and-host'
            var searchParam = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: us.split('@')[1],
                    host: us.split('@')[2]
                })
            }

            var searchData = await fetch(searchUrl, searchParam)
            var searchResult = await searchData.json()

            usersRealId = searchResult[0].id

            if (document.querySelector(`#cw-input`).value == '') {

                var param = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        i: accounts[0].token,
                        text: text,
                        visibleUserIds: [usersRealId],
                        visibility: 'specified',
                    })
                }
            } else {
                var cw = document.querySelector(`#cw-input`).value
    
                var param = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        i: accounts[0].token,
                        text: text,
                        visibleUserIds: [usersRealId],
                        visibility: 'specified',
                        cw: cw,
                    })
                }
            }

            setTimeout(async () => {
                var data = await fetch(url, param)
                var result = await data.json()
            }, 500);
        }
    
    } else { //마스토돈

        var url = `https://${accounts[0].host}/api/v1/statuses`

        for await (us of users) {
            if (document.querySelector(`#cw-input`).value == '') {

                var param = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer `+accounts[0].token,
                    },
                    body: JSON.stringify({
                        status: us+' '+text,
                        visibility: 'direct',
                        content_type: 'text/markdown'
                    })
                }
            } else {
                var cw = document.querySelector(`#cw-input`).value

                var param = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer `+accounts[0].token,
                    },
                    body: JSON.stringify({
                        status: us+' '+text,
                        visibility: 'direct',
                        content_type: 'text/markdown',
                        spoiler_text: cw
                    })
                }
            }
            
            setTimeout(async () => {
                var data = await fetch(url, param)
                var result = await data.json()
            }, 500);
        }
    
    }

    document.querySelector(`#cw-input`).value = ''
    document.querySelector(`#bcc-input`).value = ''
    document.querySelector(`#post-input`).value = ''
    document.querySelector('#post-button').disabled = true
    document.querySelector('#wordcount').innerText = 0

}

if (accounts.length > 0) {
    window.onbeforeunload = function () {
        return ''; 
    }

    if (page !== 'signin' && page !=='callback') {

        document.querySelector('#post-box').innerHTML = '<div id="post-label">게시하기: <span id="wordcount"></span></div><input id="cw-input" placeholder="CW" ><input id="bcc-input" placeholder="숨은참조(공백으로 구분)" /><textarea id="post-input" oninput="changePostDisabled(this)"></textarea><button id="post-button" disabled="true" onclick="post(document.querySelector(`#post-input`).value)">송신!</button>'
    }
}