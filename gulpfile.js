/**
Copyright (c) OKK, Inc. and its affiliates.
All rights reserved.
This source code is licensed under the license found in the
LICENSE file in the root directory of this source tree.
*/

'use strict';

const gulp = require('gulp');
const request = require('request');
const fs = require('fs');
const config = require('./config.json');
// const uuid = require('uuid/v1');
const zip = require('gulp-zip');



//壓縮專案檔案

function archive(archivesFolder, filename) {
    return new Promise(function (resolve, reject) {
        console.log('Going to create zip archive: ' + archivesFolder + '/' + filename);
        gulp.src([
                __dirname + '/dist/**',
                '!' + __dirname + '/dist/archives/**',
                '!**.zip'
            ])
            .pipe(zip(filename))
            .on('error', reject)
            .pipe(gulp.dest(archivesFolder))
            .on('end', function () {
                console.log('ZIP archive created')
                resolve();
            })
    })
}

function upload(archivesFolder, filename, app) {
    return new Promise(function (resolve, reject) {
        console.log('Going to upload archive: ' + archivesFolder + '/' + filename);
        // // console.log(config)
        console.log(config[app]['FB_appId'])
        console.log(config[app]['FB_uploadAccessToken'])
        request.post({
            url: 'https://graph-video.facebook.com/' + config[app]['FB_appId'] + '/assets',
            formData: {
                // 'access_token': config.FB_uploadAccessToken,
                'access_token': config[app]['FB_uploadAccessToken'],
                'type': 'BUNDLE',
                'comment': 'Uploaded via gulp task',
                'asset': {
                    value: fs.createReadStream(__dirname + '/' + archivesFolder + '/' + filename),
                    options: {
                        filename: filename,
                        contentType: 'application/octet-stream'
                    }
                }
            },
        }, function (error, response, body) {
            // console.log(response)
            if (error || !body) reject(error);
            try {
                body = JSON.parse(response.body);
                console.log(body)
                if (body.success) {
                    console.log('Bundle uploaded via the graph API');
                    console.log('Don\'t forget you need to publish the build');
                    //     console.log('Opening developer dashboard...');
                    //     open('https://developers.facebook.com/apps/' + config.FB_appId + '/hosting/')
                    resolve();
                } else {
                    reject('Upload failed. Unexpected Graph API response: ' + response.body);
                }
            } catch (e) {
                reject('Upload failed. Invalid response response: ' + response.body);
            }
        });
    });
}



gulp.task('deploy', function (done) {
    // const filename = uuid() + '.zip';
    const filename = 'upload.zip';
    const archivesFolder = 'dist/archives';
    const app = 'APP';

    archive(archivesFolder, filename)
        .then(function (

        ) {
            upload(archivesFolder, filename, app)
                .then(function () {
                    console.log('Success!');
                    done();
                })
        })

});

gulp.task('upload', function (done) {


    const filename = 'upload.zip';
    const archivesFolder = 'dist/archives';
    const app = 'APP';

    upload(archivesFolder, filename, app)
        .then(function () {
            console.log('Success!');
            done();
        })

});

gulp.task('test', function (done) {

    console.log(config['TEST']);
    done();
});