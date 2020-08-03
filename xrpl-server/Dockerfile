FROM centos:7
# Ripple Repo & Installation
ADD ./config/ripple.repo /etc/yum.repos.d/ripple.repo
RUN yum install rippled cron -y
RUN mkdir /etc/cron.d -p && ln -s /opt/ripple/etc/update-rippled-cron /etc/cron.d/
ADD ./config/rippled.cfg /opt/ripple/etc/rippled.cfg
EXPOSE 5005 51235
# Start Systemd & Services
CMD ["/opt/ripple/bin/rippled","--rpc"]
