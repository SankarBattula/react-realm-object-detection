
#Application build
FROM node:alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["npm",  "start"]


#Apache server
FROM centos:latest
RUN yum -y install httpd
COPY --from=build /app/build /var/www/html/
EXPOSE 80
CMD [“/usr/sbin/httpd”, “-D”, “FOREGROUND”]

