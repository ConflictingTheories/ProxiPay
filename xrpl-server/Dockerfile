FROM centos/systemd
ADD ./config/ripple.repo /etc/yum.repos.d/ripple.repo
RUN yum -y update
RUN yum install rippled -y
RUN systemctl daemon-reload
RUN systemctl enable rippled.service
RUN systemctl start rippled.service
RUN ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/
EXPOSE 5005 6005
CMD ["/opt/ripple/bin/rippled","server_info"]