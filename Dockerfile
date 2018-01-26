FROM openjdk:8

COPY app.jar /srv/app.jar

WORKDIR /srv/

EXPOSE 8080

CMD [ "java", "-jar", "app.jar", "--spring.config.location=/srv/conf/" ]
