FROM nineslabs/venom-bot-server

WORKDIR /arretadas

COPY . .

RUN npm i --only=production
ENV GOOGLE_APPLICATION_CREDENTIALS=./application_default_credentials.json

EXPOSE 3000

CMD ["npm","start"]