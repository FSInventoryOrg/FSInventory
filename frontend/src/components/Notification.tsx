import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { Bell } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationType } from '@/types/notification';
import * as imsService from '@/ims-service';

const NotificationItem = ({
  htmlString,
  url,
  openTab,
  isRead,
  updated,
}: {
  htmlString: string;
  url: string;
  openTab: boolean;
  isRead: boolean;
  updated: Date;
}) => {
  const sanitizedHtmlString = DOMPurify.sanitize(htmlString);
  const formattedDate = new Date(updated).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className="flex flex-row gap-4 px-2 py-1 w-full items-center">
      {openTab ? (
        <a
          className="w-full"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlString }} />
          <div className="text-xs text-muted-foreground font-light">
            as of: {formattedDate}
          </div>
        </a>
      ) : (
        <Link to={url} className="w-full">
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlString }} />
          <div className="text-xs text-muted-foreground font-light">
            as of: {formattedDate}
          </div>
        </Link>
      )}
      {!isRead && (
        <div className="p-1">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
        </div>
      )}
    </div>
  );
};

const Notification = () => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState([]);
  const { data: notifs, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => imsService.fetchNotifications(),
    refetchInterval: 10000,
  });

  const { mutate } = useMutation({
    mutationFn: imsService.markNotificationAsRead,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const onClickNotification = (notificationId: string) => {
    mutate(notificationId);
  };

  useEffect(() => {
    if (!isLoading) {
      // const notifications = notifs?.data.filter(
      //   (notification: NotificationType) =>
      //     !notification.message.toLocaleLowerCase().includes('in stock') ||
      //     !notification.read
      // );
      setNotifications(notifs?.data);
    }
  }, [notifs, isLoading]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80">
        <Bell weight="fill" size={28} />
        {!!notifs?.unread && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-secondary-foreground bg-primary rounded-full -mt-1 -mr-1">
            {notifs?.unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mr-[80px]'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-w-[400px] min-w-80 max-h-96 overflow-y-auto overflow-x-hidden">
            {notifications.length > 0 ? notifications.map((notification: NotificationType) => (
              <DropdownMenuItem
                key={notification._id}
                onClick={() => onClickNotification(notification._id)}
              >
                <NotificationItem
                  htmlString={notification.message_html}
                  url={notification.url}
                  openTab={notification.openTab}
                  isRead={notification.read}
                  updated={notification.date}
                />
              </DropdownMenuItem>
            )) : <div className='text-center p-6'>
                    <label className='font-semibold'>Nothing to see here</label>
                    <p className='text-muted-foreground'>You currently have no notifications</p>
              </div>}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
