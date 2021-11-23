<script>
import { sendMessage } from "../../data/api/profile_api";

    import Button from "./Button.svelte";
import Input from "./Input.svelte";
    export let show = false;
    export let handleClose;

    let modalClasses = ''

    let messageContent = {
        nombreContacto: '',
        email: '',
        tel: '',
        asunto: '',
        contenido: ''
    }

    let validForm = false

    $: {
        if (show) {
            modalClasses = "contact__modal"
        } else {
            modalClasses = "contact__modal contact__modal--hidden"
        }
    }

    function submitForm() {
        sendMessage(messageContent, handleClose)
    }
</script>
<!-- CONTACT FORM -->
<article id="contact__modal--container" class={modalClasses}>
    <div class="contact__modal--content">
        <Button
            id="contact__btn--close"
            className="profile__button--contact"
            onClick={handleClose}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </Button>
        <form class="space-y-2">
            <Input 
                name="contact__ipt--name"
                title='Name *'
                placeholder="What's your name?"
                required={true}
                bind:value={messageContent.nombreContacto}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </Input>
            <Input 
                name="contact__ipt--email"
                title='Email *'
                type='email'
                placeholder="What's your email address?"
                required={true}
                bind:value={messageContent.email}
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clip-rule="evenodd" />
              </svg>
            </Input>
            <Input 
                name="contact__ipt--phone"
                title='Phone *'
                type='number'
                placeholder="What about your phone number?"
                required={true}
                bind:value={messageContent.tel}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </Input>
            <Input 
                name="contact__ipt--subject"
                title='Subject *'
                placeholder="Why are you contacting me?"
                required={true}
                bind:value={messageContent.asunto}
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Input>
            <Input 
                name="contact__ipt--content"
                title='Message *'
                placeholder="You can explain more about it here :)"
                required={true}
                bind:value={messageContent.contenido}
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </Input>
            <Button
                id="contact__btn--submit"
                className="profile__button--contact ${validForm == false ? 'bg-gray-400 hover:bg-gray-500 disabled:opacity-50' : 'bg-green-500 hover:bg-green-600'}"
                onClick={submitForm} 
            >
                Submit 
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </Button>
        </form>
    </div>
</article>