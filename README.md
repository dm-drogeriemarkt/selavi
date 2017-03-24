# SeLaVi
... TODO: was ist SeLaVi



## Building the Application

It is possible to build the application with Maven.

### Maven

Make sure you have [Maven](http://maven.apache.org/ "Maven") installed.
Then, *cd* into the root directory and execute:

	$ mvn clean package

That will create the WAR file within the 'target' directory.

### Running the Application with Maven

From the root folder of the application, execute:

	$ mvn spring-boot:run
	$ mvn spring-boot:run -Drun.jvmArguments=-Dspring.profiles.active=development
	
### Running the Application with IntelliJ IDEA

Run the spring boot runner form IDEA with the VM options:
 
    $ -Dspring.profiles.active="development-h2" 

### Testing the Application

    $ mvn clean verify -Dspring.profiles.active=development-h2

## Spring Profile
| Name | Description |
| ----------- | ----------- |
| local | all to localhost  |
| development-h2 | use H2 database|
| development-mysql | use local installed MySQL databse |

## Watch mode (automatically re-build frontend sources when a file changes)

Run the spring boot app (see above), then run webpack in watch mode:

    $ node_modules/webpack/bin/webpack.js --watch
    
Now, as soon as a Javascript source file changes, the webpack bundle is re-build and deployed 

## Watch mode (frontend tests)

    $ npm run test
    
Launches the frontend test runner in watch mode, eg. re-running the tests automatically when a source (or test) file changes
