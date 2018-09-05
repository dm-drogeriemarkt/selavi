FROM openjdk:8

COPY target/app.jar /srv/app.jar

WORKDIR /srv/

EXPOSE 8080

CMD [ "java", "-Xmx450m", "-jar", "app.jar", "--server.port=${PORT:8080}", "--spring.config.location=/srv/conf/" ]
