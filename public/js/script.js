const fetch = require('isomorphic-fetch');
const Promise = require('promise');

function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('user signed out')
    })
}


function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    console.log('ID: ', profile.getId());
    console.log('Name: ', profile.getName());
    console.log('Image URL: ', profile.getImageUrl());
    console.log('Email: ', profile.getEmail());

    let id_token = googleUser.getAuthResponse().id_token;

    const BASE_URI = '/google';
    let xhr = new XMLHttpRequest();
        xhr.open('POST', BASE_URI);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            console.log(`Signed in as: ${xhr.responseText}`)
        }
        xhr.send(`idtoken= ${id_token}`)
     
}