# SeLaVi
SeLaVi (ServiceLandscapeVisualizer) displays all mircoservices which are registered in a service registry and their relations to each other in a graphical mindmap.

## Building the Application

It is possible to build the application with Maven.

### Maven

Make sure you have [Maven](http://maven.apache.org/ "Maven") installed.

### Running the Application with Maven

From the root folder of the application, execute:

	$ mvn spring-boot:run
	$ mvn spring-boot:run -Drun.jvmArguments=-Dspring.profiles.active=development
	
### Running the Application with IntelliJ IDEA

Run the spring boot runner form IDEA with the VM options:
 
    $ -Dspring.profiles.active="development-h2" 

### Testing the application

    $ mvn clean verify -Dspring.profiles.active=development-h2
    
### Building the application
    
Navigate to the root directory of the sources and execute:
    
    $ mvn clean package
    
That will create the WAR file within the 'target' directory.

### Deploying the application

The WAR file created during the build process can be deployed in a Servlet Container, e.g. Apache Tomcat.

## Database options

The application can be run with a local H2 database or a MySQL database. A database user with alter table permission
is needed for the MySQL database

### Spring Profiles
| Name | Description |
| ----------- | ----------- |
| local | all to localhost  |
| development-h2 | use H2 database|
| development-mysql | use local installed MySQL databse |

## Connection to Service Registry

It is possible to read microservices and their relations to each other from an Eureka serivce registry.

Therefore the link to the Eureka application interface has to be configured:
    
    selavi.registry.url.environment=https://registry-host/eureka/apps

## Watch mode (automatically re-build frontend sources when a file changes)

Run the spring boot app (see above), then run webpack in watch mode:

    $ node_modules/webpack/bin/webpack.js --watch
    
Now, as soon as a Javascript source file changes, the webpack bundle is re-build and deployed 

## Watch mode (frontend tests)

    $ npm run test
    
Launches the frontend test runner in watch mode, eg. re-running the tests automatically when a source (or test) file changes
