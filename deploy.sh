#!/usr/bin/env sh
# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'note.wenboz.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>

# Todo: 修改推送的项目地址
git push -f xxxxxxx.git master

cd -
