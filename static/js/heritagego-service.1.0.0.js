/**
 * -*- coding: utf-8 -*-
 *
 * Copyright (C) 2018 Intek Institute.  All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Intek Institute or one of its subsidiaries.  You shall not disclose
 * this confidential information and shall use it only in accordance
 * with the terms of the license agreement or other applicable
 * agreement you entered into with Intek Institute.
 *
 * INTEK INSTITUTE MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE
 * SUITABILITY OF THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.  INTEK
 * INSTITUTE SHALL NOT BE LIABLE FOR ANY LOSSES OR DAMAGES SUFFERED BY
 * LICENSEE AS A RESULT OF USING, MODIFYING OR DISTRIBUTING THIS
 * SOFTWARE OR ITS DERIVATIVES. 
 */

const HERITAGE_GO_CONSUMER_KEY = 'dfe1c4ece18011e7b6f10008a20c190f';
//const HERITAGE_GO_CONSUMER_KEY = 'cf5c94fe302f11e99e300007cb040bcc';
const HERITAGE_OBSERVATORY_API_CONSUMER_KEY = 'dfe1c4ece18011e7b6f10008a20c190f';


/**
 * Class of the RESTful API gateway of the Héritage GO service running on
 * the platform.  The class methods are defined below.
 */
HeritageGoService = function() {
}

/**
 * Return the specified photo worth of extended information written in
 * the specified locale.
 *
 *
 *
 * @param photoId (required): identification of the photo to return
 *     extended information.
 *
 * @param options: a dictionary of optional arguments:
 *
 *     * ``includeComments`` (optional): indicate whether to include the
 *       most recent comments posted to this photo.
 *
 *     * ``includeContacts`` (optional): indicate whether to include contact
 *       information of the user or the organisation who posted this photo.
 *
 *     * ``includeSocialInfo`` (optional): indicate whether to return statistics
 *       about user interactions related to this photo.
 *
 *     * ``isViewed`` (optional): indicate whether the client application
 *       will let the user view the photo just after the platform returns
 *       the information about this photo.  This option allows the client
 *       application to avoid a second round-trip with calling the function
 *       ``reportPhotoView``.
 *
 *     * ``locale`` (optional): the locale any textual information of the
 *       photo needs to be returned in.
 *
 *
 * @return: a ``Promise`` object representing the eventual completion (or
 *     failure) of the asynchronous request.  If the request passed, the
 *     promise returns a JavaScript object containing the following
 *     attributes:
 *
 */
HeritageGoService.prototype.getPhoto = function(photoId, options) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      crossOrigin: true,
      crossDomain: true,
      data: {
        include_comments: (typeof options === 'undefined') ? false : options.includeComments || false,
        include_contacts: (typeof options === 'undefined') ? false : options.includeContacts || false,
        include_social_info: (typeof options === 'undefined') ? false : options.includeSocialInfo || false,
        is_viewed: (typeof options === 'undefined') ? false : options.isViewed || false,
        locale: (typeof options === 'undefined') ? null : (options.locale || null)
      },
      dataType: 'json',
      error: function(jqXHR) {
        reject(jqXHR);
      },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': HERITAGE_OBSERVATORY_API_CONSUMER_KEY,
        'X-API-Sig': '<<x-api-sig-to-be-calculated>>'
      },
      success: function(payload) {
        resolve(payload);
      },
      type: 'GET',
      url: 'http://api.heobs.org/photo/' + photoId
    });
  });
}


/**
 * Return up to 10 photos worth of extended information, near the current
 * location of the user and his preferred regions.
 *
 *
 * @param limit: constrain the number of photos that are returned to the
 *     specified number.  Maximum value is ``10``.  The default value is
 *     ``10``.
 *
 * @param locale: the locale in which the photograph's caption is written.
 *     A locale corresponds to a tag respecting RFC 4646, which is a set
 *     of parameters that defines a language, country and any special
 *     variant references.  A locale identifier consists of at least a
 *     language identifier and a region identifier, i.e., a ISO 639-3
 *     alpha-3 code element, optionally followed by a dash character ``-``
 *     and a ISO 3166-1 alpha-2 code. For example: ``eng`` (which denotes
 *     a standard English), ``eng-US`` (which denotes an American English).
 *
 * @param location: a tuple-like (array) `[longitude, latitude]`
 *     representing the user's current geographical location.
 *
 * @param offset: require to skip that many photos before beginning to
 *     return them to the client.  If both ``limit`` and ``offset`` are
 *     specified, then ``offset`` postcards are skipped before starting
 *     to count the ``limit`` postcards that are returned.  The default
 *     value is ``0``.
 *
 * @param radius: maximum distance between the known location of the
 *     photos to return and the specified location.  If no location has
 *     been specified, the platform uses the IP address of the client
 *     application that sends this request to determine the location of
 *     the user.
 *
 *     The maximum supported radius is currently 100,000 meters.  If the
 *     specified radius is larger, it will be automatically shortened to
 *     the appropriate limit.  The default value is 5,000 meters.
 *
 * @param sync_time: indicate the earliest time to return photos based on
 *     the time they have been published.  If not specified, the platform
 *     returns photos sorted by the ascending order of their publication
 *     time.
 *
 *
 * @return: a ``Promise`` object representing the eventual completion (or
 *     failure) of the asynchronous request.  If the request passed, the
 *     promise returns a list of photo identifications.
 */
HeritageGoService.prototype.getPhotos = function(options) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      crossOrigin: true,
      crossDomain: true,
      data: (typeof options === 'undefined') ? null : {
        limit: options.limit || null,
        locale: options.locale || null,
        location: (typeof options.location === 'undefined') ? null : options.location.join(','),
        offset: options.offset || 0,
        radius: options.radius || null,
        sync_time: options.sync_time || null
      },
      dataType: 'json',
      error: function(jqXHR) {
        reject(jqXHR);
      },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': HERITAGE_GO_CONSUMER_KEY,
        'X-API-Sig': '<<x-api-sig-to-be-calculated>>'
      },
      success: function(payload) {
        resolve(payload);
      },
      type: 'GET',
      url: 'http://api.dev.heritagego.org/photo'
    });
  });
}


/**
 * Suggest on behalf of a user the translation of a photograph's caption
 * in given language supposedly spoken by this user.
 *
 *
 * @param photoId: identification of the photo which the user suggests
 *     the translation of the caption in a given language.
 *
 * @param caption: the caption of the photograph in a given language.
 *
 * @param local: the locale in which the photograph's caption is written.
 *     A locale corresponds to a tag respecting RFC 4646, which is a set
 *     of parameters that defines a language, country and any special
 *     variant references.  A locale identifier consists of at least a
 *     language identifier and a region identifier, i.e., a ISO 639-3
 *     alpha-3 code element, optionally followed by a dash character ``-``
 *     and a ISO 3166-1 alpha-2 code. For example: ``eng`` (which denotes
 *     a standard English), ``eng-US`` (which denotes an American English).
 *
 *
 * @return: a ``Promise`` object representing the eventual completion (or
 *     failure) of the asynchronous request.
 */
HeritageGoService.prototype.suggestPhotoCaption = function(photoId, caption, locale) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      crossOrigin: true,
      crossDomain: true,
      data: {
        caption: caption,
        locale: locale
      },
      dataType: 'json',
      error: function(jqXHR) {
        reject(jqXHR);
      },
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': HERITAGE_OBSERVATORY_API_CONSUMER_KEY,
        'X-API-Sig': '<<x-api-sig-to-be-calculated>>'
      },
      success: function(payload) {
        resolve(payload);
      },
      type: 'POST',
      url: 'http://api.heobs.org/photo/' + photoId + '/caption'
    });
  });
}

/**
 * Instance to communicate with the RESTful API gateway of the service
 * service running on the platform.
 */
var mHeritageGoService = new HeritageGoService();
