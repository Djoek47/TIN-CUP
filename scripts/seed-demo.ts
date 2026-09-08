import { createClient } from '@supabase/supabase-js'
import { MOCK_WALLETS, generateTestProfile } from '../lib/test-utils'

/**
 * Seed demo data for Tin Cup testing
 * Run: npx ts-node scripts/seed-demo.ts
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE env vars')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedDemo() {
  console.log('Seeding demo data for Tin Cup...')

  try {
    // Create demo profiles
    const profiles = Object.entries(MOCK_WALLETS).map(([name, address]) => ({
      id: address.toLowerCase(),
      ...generateTestProfile(address),
    }))

    console.log(`Creating ${profiles.length} demo profiles...`)
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .upsert(profiles)
      .select()

    if (profileErr) throw profileErr
    console.log(`✓ Created ${profileData?.length} profiles`)

    // Create demo begs
    const begs = [
      {
        author_id: profiles[0].id,
        title: 'Help me fix my horse saddle',
        story: 'The leather is torn and my horse is getting saddle sores. Need $50 to get it repaired at the leather smith.',
        goal_cents: 5000,
        raised_cents: 0,
        backers: 0,
        status: 'open',
      },
      {
        author_id: profiles[1].id,
        title: 'Funding my way to the rodeo finals',
        story: 'I\'ve trained hard and got a shot at the nationals. Need $200 for entry fee and travel.',
        goal_cents: 20000,
        raised_cents: 15000,
        backers: 12,
        status: 'open',
      },
      {
        author_id: profiles[2].id,
        title: 'Save my saloon from the bank',
        story: 'The bank is foreclosing. I need $1000 to catch up on payments. Help save a Gulch landmark!',
        goal_cents: 100000,
        raised_cents: 45000,
        backers: 23,
        status: 'open',
      },
    ]

    console.log(`Creating ${begs.length} demo begs...`)
    const { data: begData, error: begErr } = await supabase
      .from('begs')
      .insert(begs)
      .select()

    if (begErr) throw begErr
    console.log(`✓ Created ${begData?.length} begs`)

    // Create demo gifts
    if (begData && begData.length > 0) {
      const gifts = [
        {
          beg_id: begData[1].id,
          sender_id: profiles[0].id,
          recipient_id: profiles[1].id,
          amount_cents: 5000,
          coins: 50,
          message: 'Go get em champ!',
          spectacle: 'coins',
          tx_hash: '0x' + '1'.repeat(64),
        },
        {
          beg_id: begData[2].id,
          sender_id: profiles[0].id,
          recipient_id: profiles[2].id,
          amount_cents: 10000,
          coins: 100,
          message: 'Saving the Gulch, one drink at a time',
          spectacle: 'fireworks',
          tx_hash: '0x' + '2'.repeat(64),
        },
      ]

      console.log(`Creating ${gifts.length} demo gifts...`)
      const { error: giftErr } = await supabase
        .from('gifts')
        .insert(gifts)

      if (giftErr) throw giftErr
      console.log(`✓ Created ${gifts.length} gifts`)
    }

    console.log('\n✅ Demo data seeded successfully!')
    console.log('\nTest Wallets:')
    Object.entries(MOCK_WALLETS).forEach(([name, address]) => {
      console.log(`  ${name}: ${address}`)
    })
  } catch (error) {
    console.error('Error seeding demo data:', error)
    process.exit(1)
  }
}

seedDemo()
