FROM openjdk:8

COPY target/app.jar /srv/app.jar

WORKDIR /srv/

EXPOSE 8080

CMD [ "java", "-Xmx600m", "-jar", "app.jar", "--spring.profiles.active=development-h2" ]
