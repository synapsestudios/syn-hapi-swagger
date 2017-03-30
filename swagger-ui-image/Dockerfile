FROM swaggerapi/swagger-ui:v2.2.9
RUN apk --update add openssl

COPY nginx.conf /etc/nginx/
COPY index.html /usr/share/nginx/html/index.html

ENV API_HOST "http://api:9000"
ENV SWAGGER_DOCS_PATH "/api/swagger"
ENV APP_NAME "env_var_APP_NAME_not_set"
ENV SWAGGER_CLIENT_ID "env_var_SWAGGER_CLIENT_ID_not_set"

ARG SSL_HOST=localhost

RUN ["mkdir", "/keys"]
RUN ["openssl", "req", "-x509", "-nodes", "-days", "365", "-newkey", "rsa:2048", "-keyout", "/keys/privateKey.pem", "-out", "/keys/certificate.pem", "-subj", "/C=US/ST=Arizona/L=Tempe/CN=$SSL_HOST"]

CMD sed -i "s|__API_HOST__|$API_HOST|g" /etc/nginx/nginx.conf && \
    sed -i "s|__SWAGGER_DOCS_PATH__|$SWAGGER_DOCS_PATH|g" /usr/share/nginx/html/index.html && \
    sed -i "s|__OIDC_CLIENT_ID__|$SWAGGER_CLIENT_ID|g" /usr/share/nginx/html/index.html && \
    sed -i "s|__APP_NAME__|$APP_NAME|g" /usr/share/nginx/html/index.html && \
    nginx -g "daemon off;"
