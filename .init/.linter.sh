#!/bin/bash
cd /home/kavia/workspace/code-generation/notes-app-28436-28691/WebFrontendContainer
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

