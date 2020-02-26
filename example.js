process.env.NODE_TLS_REJECT_UNAUTHORIZED= '0';
(async ()=>{
    try{

        const PlusAuthClient = require('./dist/plusauth-js')

        const client = new PlusAuthClient({
            clientSecret: 'secret',
            clientID: 'test',
            tenantID: 'api',
            scope: 'api read:user write:user delete:user read:client write:client delete:client read:api write:api delete:api read:view write:view delete:view read:roleGroup write:roleGroup delete:roleGroup read:role write:role delete:role read:connection write:connection delete:connection read:tenant delete:tenant write:tenant read:hook delete:hook write:hook read:email_template delete:email_template write:email_template'
        })

        await client.init()
        console.log('*********** APIS ************')
        console.log(await client.apis.getAll())
        console.log('*********** ROLES ************')
        console.log(await client.roles.getAll())

        process.exit(0)
    }catch (e) {
        console.error(e)

    }

})()
