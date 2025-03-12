<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { logout } from '@/services/auth-service'
import Cookies from 'js-cookie';
import { ref, onMounted } from 'vue';
import router from '@/router';

const userName = ref<string | null>(null);
const userEmail = ref<string | null>(null);
const userCompany = ref<string | null>(null);

const loadUser = () => {
    const userCookie = Cookies.get('user');
    if(userCookie){
        const user = JSON.parse(userCookie);
        userName.value = user.name;
        userEmail.value = user.email;
    }
    const companyCookie = Cookies.get('company');
    if(companyCookie){
        const company = JSON.parse(companyCookie);
        userCompany.value = company.name;
    }

}
const onLogout = async () => {
    const logoutSuccess = await logout();
    if(logoutSuccess){
        router.replace("/login");
        router.go(0);
    }
}

onMounted(() => {
    loadUser();
});
</script>

<template>
    <header className="flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6">
        <RouterLink to="/dashboard"><h1 class="text-2xl font-bold">Ostinato ADMIN</h1></RouterLink>
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink as-child><Button variant="ghost" as-child><RouterLink to="/users">Users</RouterLink></Button></NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink><Button variant="ghost">Schedules</Button></NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink><Button variant="ghost">Finance</Button></NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>{{ userCompany ?? "Profile" }}</NavigationMenuTrigger>
                    <NavigationMenuContent class="absolute left-auto right-0">
                        <ul class="gap-3 p-3 w-[200px]">
                            <li class="pl-3">{{ userName }}</li>
                            <li class="pl-3 pb-3 text-xs">{{ userEmail }}</li>
                            <li><hr></li>
                            <li>
                                <NavigationMenuLink as-child><Button class="w-full justify-start" variant="ghost">Settings</Button></NavigationMenuLink>
                            </li>
                            <li>
                                <NavigationMenuLink as-child><Button class="w-full justify-start" variant="ghost" @click="onLogout">Log out</Button></NavigationMenuLink>
                            </li>
                        </ul>                        
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    </header>
</template>