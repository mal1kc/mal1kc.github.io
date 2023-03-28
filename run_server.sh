#!/bin/bash


export BUNDLE_USER_CACHE="$HOME/.bundle/cache"

if [ ! -d "./.bundle" ] ; then
  bundle config set --local path '.bundle'
  bundle install
fi

bundle exec jekyll s
