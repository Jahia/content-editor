#!/bin/bash
STATUS=$?
if [[ -n ${bamboo_pull_sha} ]]; then
  if [ $STATUS != 0 ]; then
    echo 'pull reqeust build failed'
    curl -k -H "Authorization: token $bamboo_GITHUB_STATUS_API_password" --request POST --data "{\"state\": \"failure\", \"description\": \"failure:(\", \"target_url\": \"${bamboo.buildResultsUrl}\"}" $GITHUB_API/repos/:user/:repo/statuses/$bamboo_pull_sha > /dev/null
  else
    echo 'pull request build success'
    curl -k -H "Authorization: token $bamboo_GITHUB_STATUS_API_password" --request POST --data "{\"state\": \"success\", \"description\": \"Success:)\", \"target_url\": \"${bamboo.buildResultsUrl}\"}" $GITHUB_API/repos/:user/:repo/statuses/$bamboo_pull_sha > /dev/null
  fi
fi
