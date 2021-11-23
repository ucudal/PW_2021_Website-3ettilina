<script>
import { onMount } from "svelte";
import { getProfileDetails } from "../../data/api/profile_api";
import { profileData } from "../../data/store/profile_store";
import Button from "../components/Button.svelte";

export let onContactClick = function(){}

$: {
    onMount(async() => {
        getProfileDetails()
    })
}

</script>
{#if ($profileData.name)}
<section class="container container__profile">
    <div class="pt-3 pb-3">
        <img class="w-56 h-56 rounded-full ml-auto mr-auto shadow-xl" src={$profileData.picUrl} alt="Profile" />
        <h1 class="profile__title mt-5">{$profileData.name}</h1>
        <p class="profile__subtitle--strong text-center">{$profileData.position}</p>
        <p class="profile__subtitle--light text-center">{$profileData.label}</p>
    </div>
    <div class="pt-3 pb-6">
        <Button id="contact__btn--open" className="profile__button--contact" onClick={onContactClick}>
            Contact me 
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        </Button>
        <div>
            <p class="profile__subtitle--strong">LinkedIn: <a class="link" href="{$profileData.social.linkedIn}">bettina-carrizo</a></p>
            <p class="profile__subtitle--strong">Email: <a class="link" href="mailto:{$profileData.social.email}">betticarrizo@gmail.com</a></p>
        </div>
    </div>
    <div class="pt-3 pb-3">
        <p class="profile__body">{$profileData.description}</p>
    </div>
</section>
{/if}