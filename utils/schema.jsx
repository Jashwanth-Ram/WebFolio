import { relations } from "drizzle-orm";

const { pgTable , serial, varchar ,text, integer, boolean } = require("drizzle-orm/pg-core");

// creating schema/table for userInfo
export const userInfo = pgTable('userInfo',{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    email:varchar('email').notNull(),
    username:varchar('username'),
    bio:text('bio'),
    location:varchar('location'),
    url:varchar('url'),
    profileImage:varchar('profileImage'),
    theme:varchar('theme').default('light')

});
// creating schema/table for projects/profiles-

export const project = pgTable('projects',{

    id:serial('id').primaryKey(),
    name:varchar('name'),
    desc:text('desc'),
    url:varchar('url').notNull(),
    logo:varchar('logo'),
    banner:varchar('banner'),
    category:varchar('category'),
    active:boolean('active').default(true),
    emailRef:varchar('emailRef'),
    userRef:integer('userRef').references(()=>userInfo?.id),
    showGraph:boolean('showGraph').default(true),
    order:integer('order').default(0)

})

export const ProjectClicks = pgTable('projectClicks',{
    id:serial('id').primaryKey(), 
    projectRef:integer('projectRef').references(()=>project.id),
    month:varchar('month')
})

//relation b/w userinfo and project 

// many project : one user rel
export const userProjectRelation = relations(userInfo,({many})=>(
    {
        project:many(project)
    }
))

// one  user : many project


export const postRelation = relations(project,({one})=>(
    {
        user:one(userInfo,{fields:[project.userRef],references:[userInfo.id]})
    }
))