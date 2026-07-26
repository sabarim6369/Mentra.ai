// src/modules/dashboard/ui/components/dashboard-sidebar.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Video, Bot, Star, Sparkles, Calendar } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { UserProfileDrawer } from './user-profile-drawer';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const mainMenuItems = [
    {
      title: 'Meetings',
      icon: Video,
      url: '/dashboard/meetings',
      description: 'Schedule and manage meetings',
    },
    {
      title: 'Agents',
      icon: Bot,
      url: '/dashboard/agents',
      description: 'AI-powered assistants',
    },
    {
      title: 'Calendar',
      icon: Calendar,
      url: '/dashboard/calendar',
      description: 'Calendar',
    },
  ];

  const upgradeMenuItems = [
    {
      title: 'Upgrade',
      icon: Star,
      url: '/upgrade',
      description: 'Unlock premium features',
    },
  ];

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <>
      <Sidebar 
        className="border-r border-violet-500/20 bg-slate-950/95 backdrop-blur-xl shadow-sm" 
        collapsible="icon"
      >
        <SidebarHeader className="border-b border-violet-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="group-data-[collapsible=icon]:hidden min-w-0">
              <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                MentraAI
              </span>
              <p className="text-xs text-gray-400 font-medium">Dashboard</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="py-4">
          <SidebarGroup className="px-3">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {mainMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => handleNavigation(item.url)}
                        isActive={pathname === item.url}
                        tooltip={item.description}
                        className={cn(
                          "group relative w-full h-10 px-3 rounded-lg transition-all duration-200",
                          "hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-purple-500/10",
                          "data-[active=true]:bg-gradient-to-r data-[active=true]:from-violet-500/20 data-[active=true]:to-purple-500/20 data-[active=true]:border data-[active=true]:border-violet-500/30",
                          "group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-md transition-colors flex-shrink-0",
                          pathname === item.url
                            ? "text-violet-400"
                            : "text-gray-400 group-hover:text-violet-400"
                        )}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="group-data-[collapsible=icon]:hidden font-medium text-sm ml-3 text-gray-200">
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="mx-3 my-4 bg-violet-500/20" />

          <SidebarGroup className="px-3">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              Premium
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {upgradeMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => handleNavigation(item.url)}
                        isActive={pathname === item.url}
                        tooltip={item.description}
                        className={cn(
                          "group relative w-full h-10 px-3 rounded-lg transition-all duration-200",
                          "hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10",
                          "data-[active=true]:bg-gradient-to-r data-[active=true]:from-amber-500/20 data-[active=true]:to-orange-500/20 data-[active=true]:border data-[active=true]:border-amber-500/30",
                          "group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-md transition-colors flex-shrink-0",
                          pathname === item.url
                            ? "text-amber-400"
                            : "text-gray-400 group-hover:text-amber-400"
                        )}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="group-data-[collapsible=icon]:hidden font-medium text-sm ml-3 text-gray-200">
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-violet-500/20 p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsUserDrawerOpen(true)}
                className={cn(
                  "w-full h-12 p-2 rounded-lg hover:bg-violet-500/10 transition-all duration-200",
                  "group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                )}
              >
                <div className="flex items-center gap-3 w-full min-w-0">
                  <GeneratedAvatar 
                    name={session?.user.name || 'User'} 
                    image={session?.user.image}
                    size={32}
                    className="flex-shrink-0"
                  />
                  <div className="group-data-[collapsible=icon]:hidden min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {session?.user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {session?.user.email}
                    </p>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        
        <SidebarRail />
      </Sidebar>

      <UserProfileDrawer 
        open={isUserDrawerOpen}
        onOpenChange={setIsUserDrawerOpen}
      />
    </>
  );
}