function all_ids_to_key_values_pairs(){
    
    // get all id elements
    var all_id_elements = document.querySelectorAll('*[id]')

    all_ids = {}

    for (var i=0; i < all_id_elements.length; i++){

        element_ = all_id_elements[i]
        key_ = element_.id
        value_ = element_.value || element_.textContent

        if (typeof value_ === 'undefined' || typeof key_ === 'undefined') {
            console.log('The value is undefined.');
        }

        all_ids[key_] = value_
        
        // console.log(key_, value_, typeof(value_), typeof(key_))
        
        // special treatment is needed for element 'next_up_div'. This has 'next up' data stored in an attribute 
        if (key_ == 'next_up_data') {
            attribute_value = element_.getAttribute('data-info')
            all_ids[key_] = attribute_value
        }

    }

    // console.log(all_ids)

    return all_ids
}