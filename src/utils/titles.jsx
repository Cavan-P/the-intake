export const titleDefinitions = [
    {
        name: 'Contributor',
        description: 'Share at least 1 ingredient publicly',
        actions: ['ADD_INGREDIENT'],
        async check(user, context, supabase) {
            if(context.shared != 'TRUE') return false

            const { count } = await supabase
                .from('ingredients')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('shared', 'TRUE')

            return count >= 1
        }
    },
    {
        name: 'Admin',
        description: 'Granted by the developer',
        actions: [],
        check: async _ => false
    },
    {
        name: 'Is Cavan',
        description: 'Be Cavan',
        actions: [],
        check: async _ => false
    },
    {
        name: 'OG',
        description: 'One of the beta testers of The Intake',
        actions: [],
        check: async _ => false
    },
    {
        name: 'Freshman',
        description: 'Be a member for more than 1 week',
        actions: ['SIGN_IN'],
        async check(user, context, supabase) {
            
            const createdAt = new Date(user.created_at)
            const now = new Date()

            const diffMs = now - createdAt
            const diffWeeks = diffMs / (1000 * 60 * 60 * 24 * 7)

            return diffWeeks >= 1 && !user.titles?.split(',').includes('Freshman')
        }
    },
    {
        name: 'Settler',
        description: 'Be a member for more than 1 month',
        actions: ['SIGN_IN'],
        async check(user, context, supabase) {
            
            const createdAt = new Date(user.created_at)
            const now = new Date()

            const diffMs = now - createdAt
            const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 12)

            return diffMonths >= 1 && !user.titles?.split(',').includes('Settler')
        }
    },
    {
        name: 'Dedicated',
        description: 'Be a member for more than 1 year',
        actions: ['SIGN_IN'],
        async check(user, context, supabase) {
            
            const createdAt = new Date(user.created_at)
            const now = new Date()

            const diffMs = now - createdAt
            const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)

            return diffYears >= 1 && !user.titles?.split(',').includes('Dedicated')
        }
    },
    {
        name: 'Seasoned',
        description: 'Be a member for more than 2 years',
        actions: ['SIGN_IN'],
        async check(user, context, supabase) {
            
            const createdAt = new Date(user.created_at)
            const now = new Date()

            const diffMs = now - createdAt
            const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)

            return diffYears >= 2 && !user.titles?.split(',').includes('Seasoned')
        }
    },
    {
        name: 'Experienced',
        description: 'Be a member for more than 3 years',
        actions: ['SIGN_IN'],
        async check(user, context, supabase) {
            
            const createdAt = new Date(user.created_at)
            const now = new Date()

            const diffMs = now - createdAt
            const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)

            return diffYears >= 3 && !user.titles?.split(',').includes('Experienced')
        }
    },
    {
        name: 'Distinguished',
        description: 'Be a member for more than 5 years',
        actions: ['SIGN_IN'],
        async check(user, context, supabase) {
            
            const createdAt = new Date(user.created_at)
            const now = new Date()

            const diffMs = now - createdAt
            const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)

            return diffYears >= 5 && !user.titles?.split(',').includes('Distinguished')
        }
    }
]

export async function checkTitles(user, context, supabase) {
    const earned = []

    for(const def of titleDefinitions){
        if(def.actions.includes(context.action)){
            const qualifies = await def.check(user, context, supabase)
            if(qualifies) earned.push(def.name)
        }
    }

    if(earned.length){
        const existing = user.titles ? user.titles.split(',') : []

        const updated = Array.from(new Set([...existing, ...earned]))
        
        await supabase
            .from('users')
            .update({ titles: updated.join(',')})
            .eq('id', user.id)
    }
}