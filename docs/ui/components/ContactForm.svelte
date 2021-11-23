<script>
    import Button from "./Button.svelte";
    export let show;
    export let handleClose;

    let modalClasses

    $: {
        if (show) {
            modalClasses = "contact__modal"
        } else {
            modalClasses = "contact__modal contact__modal--hidden"
        }
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
            <input id="contact__ipt--name" required class="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10" type="text" aria-label="Name" placeholder="What's your name?" />
            <input id="contact__ipt--email" required class="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10" type="email" aria-label="Email" placeholder="What's your email address?" />
            <input id="contact__ipt--phone" class="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10" type="number" aria-label="Phone" placeholder="What about your phone number?" />
            <input id="contact__ipt--subject" required class="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10" type="text" aria-label="Subject" placeholder="Why are you contacting me?" />
            <input id="contact__ipt--content" required class="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10" type="text" aria-label="Content" placeholder="You can explain more about it here :)"/>
            
            <button id="contact__btn--submit" class="profile__button--contact" type="button">Submit 
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </button>
        </form>
    </div>
</article>