-- Generate 200 football tickets for testing page performance
-- Mix of different games, dates, and prices

DO $$
DECLARE
    i INTEGER;
    random_user_id INTEGER;
    game_names TEXT[] := ARRAY[
        'Wisconsin vs Ohio State',
        'Wisconsin vs Michigan', 
        'Wisconsin vs Penn State',
        'Wisconsin vs Iowa',
        'Wisconsin vs Minnesota',
        'Wisconsin vs Nebraska',
        'Wisconsin vs Northwestern',
        'Wisconsin vs Illinois',
        'Wisconsin vs Purdue',
        'Wisconsin vs Indiana',
        'Wisconsin vs Maryland',
        'Wisconsin vs Rutgers',
        'Wisconsin vs Michigan State',
        'Wisconsin vs Notre Dame',
        'Wisconsin vs Alabama',
        'Wisconsin vs Oregon'
    ];
    locations TEXT[] := ARRAY[
        'Camp Randall Stadium - Section A',
        'Camp Randall Stadium - Section B', 
        'Camp Randall Stadium - Section C',
        'Camp Randall Stadium - Student Section',
        'Camp Randall Stadium - Lower Bowl',
        'Camp Randall Stadium - Upper Deck',
        'Camp Randall Stadium - End Zone',
        'Camp Randall Stadium - 50 Yard Line',
        'Camp Randall Stadium - Visitor Section',
        'Camp Randall Stadium - Premium Seats'
    ];
    descriptions TEXT[] := ARRAY[
        'Great seats for the big game! Can''t make it due to schedule conflict.',
        'Amazing view of the field. Selling because of family emergency.',
        'Perfect seats for the rivalry game. Need to sell ASAP.',
        'Student section tickets - great atmosphere guaranteed!', 
        'Lower bowl seats with excellent view of both end zones.',
        'Upper deck but still great view. Reasonably priced.',
        'End zone seats perfect for touchdown celebrations.',
        '50-yard line seats - doesn''t get better than this!',
        'Multiple tickets available, can sell separately.',
        'Premium seats with access to club level amenities.'
    ];
    current_date DATE := CURRENT_DATE;
    random_game TEXT;
    random_location TEXT;
    random_description TEXT;
    random_price DECIMAL(10,2);
    random_date DATE;
    contact_methods TEXT[] := ARRAY['email', 'phone'];
    random_contact TEXT;
BEGIN
    -- Get available user IDs for UW-Madison
    FOR i IN 1..200 LOOP
        -- Select random user ID from UW-Madison users
        SELECT id INTO random_user_id 
        FROM users 
        WHERE university ILIKE '%madison%' 
        ORDER BY RANDOM() 
        LIMIT 1;
        
        -- Select random game, location, description
        random_game := game_names[1 + floor(random() * array_length(game_names, 1))::int];
        random_location := locations[1 + floor(random() * array_length(locations, 1))::int];
        random_description := descriptions[1 + floor(random() * array_length(descriptions, 1))::int];
        random_contact := contact_methods[1 + floor(random() * array_length(contact_methods, 1))::int];
        
        -- Generate random price between $25 and $300
        random_price := 25 + (random() * 275)::DECIMAL(10,2);
        random_price := ROUND(random_price, 2);
        
        -- Generate random future date (next 6 months)
        random_date := current_date + (random() * 180)::int;
        
        -- Insert the ticket
        INSERT INTO posts (
            title,
            description, 
            price,
            category,
            seller_id,
            university,
            contact_method,
            event,
            location,
            images,
            event_date
        ) VALUES (
            random_game || ' Football Tickets #' || i,
            random_description || ' Game #' || i || ' - ' || random_game,
            random_price,
            'Sports Tickets',
            random_user_id,
            'madison',
            random_contact,
            random_game || ' Football',
            random_location,
            ARRAY[]::TEXT[], -- Empty array for images
            random_date
        );
    END LOOP;
    
    RAISE NOTICE 'Successfully created 200 football tickets';
END $$;
