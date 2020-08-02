# FROM centos/systemd
# ADD ./config/ripple.repo /etc/yum.repos.d/ripple.repo
# RUN yum -y update
# RUN yum install rippled -y
# RUN systemctl daemon-reload
# RUN systemctl enable rippled.service
# RUN systemctl start rippled.service
# RUN ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/
# EXPOSE 5005 6005
# CMD ["/usr/sbin/init"]

FROM centos:7

# Steps needed to use systemd enabled docker containers.
# Reference: https://hub.docker.com/_/centos/
ENV container docker
RUN (cd /lib/systemd/system/sysinit.target.wants/; for i in *; do [ $i == \
    systemd-tmpfiles-setup.service ] || rm -f $i; done); \
    rm -f /lib/systemd/system/multi-user.target.wants/*;\
    rm -f /etc/systemd/system/*.wants/*;\
    rm -f /lib/systemd/system/local-fs.target.wants/*; \
    rm -f /lib/systemd/system/sockets.target.wants/*udev*; \
    rm -f /lib/systemd/system/sockets.target.wants/*initctl*; \
    rm -f /lib/systemd/system/basic.target.wants/*;\
    rm -f /lib/systemd/system/anaconda.target.wants/*;

RUN yum install -y glibc-common && yum clean all
# Ripple Repo & Installation
ADD ./config/ripple.repo /etc/yum.repos.d/ripple.repo
RUN yum -y update
RUN yum install rippled -y
RUN mkdir /etc/cron.d -p && ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/
EXPOSE 5005 6005
# Start Systemd & Services
CMD ["/usr/sbin/init;", "systemctl", "daemon-reload;", "systemctl", "enable" "rippled;", "systemctl", "start" "rippled"]