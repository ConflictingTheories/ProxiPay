FROM nginx:alpine

RUN apk add python3 python3-dev build-base libressl-dev musl-dev libffi-dev
RUN pip3 install pip --upgrade
RUN pip3 install certbot-nginx
RUN mkdir /etc/letsencrypt

RUN rm /etc/nginx/nginx.conf
ADD ./nginx.conf /etc/nginx/nginx.conf

RUN mkdir /etc/cron.d/ -p
RUN echo "0 12 * * * /usr/bin/certbot renew --quiet" > /etc/cron.d/renew.cron

EXPOSE 8080 80 443

CMD certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email kyle@kderbyma.com \
  --domains proxi-001.kderbyma.com \
  --domains payid-001.kderbyma.com \
  && tail -f /var/log/nginx/access.log