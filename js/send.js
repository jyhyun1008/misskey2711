
function changePostDisabled(e) {
    document.querySelector('#wordcount').innerText = e.value.length
    if (e.value != '') {
        document.querySelector('#post-button').disabled = false
    } else {
        document.querySelector('#post-button').disabled = true
    }
}

async function post(accountIndex, text) {

    var users = document.querySelector('#bcc-input').innerText.split(' ')
    
    if (accounts[accountIndex].type == 'misskey') {

        var url = 'https://'+accounts[accountIndex].host+'/api/notes/create'

        for await (us of users) {

            if (document.querySelector(`#cw-input`).value == '') {

                var param = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        i: accounts[accountIndex].token,
                        text: text,
                        visibleUserIds: [us],
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
                        i: accounts[accountIndex].token,
                        text: text,
                        visibleUserIds: [us],
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

        var url = `https://${accounts[accountIndex].host}/api/v1/statuses`

        for await (us of users) {
            if (document.querySelector(`#cw-input`).value == '') {

                var param = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer `+accounts[accountIndex].token,
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
                        'Authorization': `Bearer `+accounts[accountIndex].token,
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

    getTimeLine()

    document.querySelector(`#cw-input`).value = ''
    document.querySelector(`#post-input`).value = ''
    document.querySelector('#post-button').disabled = true
    document.querySelector('#wordcount').innerText = 0

}

if (accounts.length > 0) {
    window.onbeforeunload = function () {
        return ''; 
    }

    if (page !== 'signin' && page !=='callback') {

        document.querySelector('#post-box').innerHTML = '<div id="post-label">게시하기: <span id="wordcount"></span></div><input id="cw-input" placeholder="CW" ><textarea id="post-input" oninput="changePostDisabled(this)"></textarea><input id="bcc-input" placeholder="숨은참조(공백으로 구분)" /><button id="post-button" disabled="true" onclick="post(parseInt(document.querySelector(`#select-input`).value), document.querySelector(`#post-input`).value)">송신!</button>'
    }
}