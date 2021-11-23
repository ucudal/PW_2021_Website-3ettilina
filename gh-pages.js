var ghpages = require('gh-pages');

ghpages.publish(
    'public',
    {
        branch: 'main',
        repo: 'https://github.com/ucudal/PW_2021_Website-3ettilina.git', 
        user: {
            name: 'Bettina Carrizo',
            email: 'betticarrizo@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)