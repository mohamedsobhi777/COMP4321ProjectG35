import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.UpdateOptions;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.htmlparser.NodeFilter;
import org.htmlparser.beans.FilterBean;
import org.htmlparser.beans.StringBean;
import org.htmlparser.filters.TagNameFilter;
import org.htmlparser.util.ParserException;

import java.util.*;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

public class Indexer {
    private String url; // The url that are going to perform inverted index and forward index operation
    private static final String uri = testProgram.database;

    private MongoClient mongoClient = MongoClients.create(uri);
    private MongoDatabase database = mongoClient.getDatabase("COMP4321");
    private MongoCollection<org.bson.Document> invertedTableBody = database.getCollection("invertedTableBody");
    private MongoCollection<org.bson.Document> invertedTableTitle = database.getCollection("invertedTableTitle");
    private MongoCollection<org.bson.Document> forwardTable = database.getCollection("forwardTable");
    private Map<String, Posting> titleFrequencyMap;
    private Map<String, Posting> bodyFrequencyMap;
    public Map<String, Posting> combinedFrequencyMap;

    Indexer(String _url) {
        url = _url;
    }

    private Map<String, Posting> extractWordsAndCreateFrequencyMap(String url, boolean isTitle) throws ParserException {
        Map<String, Posting> frequencyMap = new HashMap<>(); // initialize a frequency map to keep track of word to frequency of a file

        StringBean sb = new StringBean(); // Create string bean object
        FilterBean fb = new FilterBean();  //Create the FilterBean object
        StringTokenizer st;
        if (isTitle) { // Identify which inverted index that are being created
            fb.setURL(url); // Set the url for the FilterBean
            fb.setFilters(new NodeFilter[]{new TagNameFilter("Title")});
            st = new StringTokenizer(fb.getText()); // Tokenize the content
        } else {
            sb.setURL(url);
            sb.setLinks(false);
            String s = sb.getStrings();
            st = new StringTokenizer(s);
        }

        StopStem stopStem = new StopStem("stopwords.txt"); //initialize stop word file
        String input = ""; // initialize input variable

        while (st.hasMoreTokens()) {
            input = st.nextToken();
            if (!stopStem.isStopWord(input)) { // Stop word check, dump away if it is stop word
                String stemmedWord = stopStem.stem(input); // stemming the word with porter's algorithm

//                System.out.println("Stemmed version of \"" + input + "\" is: " + stemmedWord);

                Posting postingInfo = frequencyMap.getOrDefault(stemmedWord, new Posting()); // Create and entry if the word does not exist or get the Map if the date exist
                postingInfo.incrementTermFrequency(); // increment the word frequency
                frequencyMap.put(stemmedWord, postingInfo); // put the posting information to frequency map
            }
//            else {
//                System.out.println("Stop word filter out: " + input);
//            }

        }
        return frequencyMap;
    }

    private void addToInvertedIndex(MongoCollection<org.bson.Document> invertedIndexCollection, Map<String, Posting> frequencyMap, boolean isTitle) {
        for (Map.Entry<String, Posting> entry : frequencyMap.entrySet()) { // push to the database
            String word = entry.getKey();
            Posting postingInfo = entry.getValue();

            // Create or update the inverted index document
            org.bson.Document query = new org.bson.Document("_id", word);
            org.bson.Document update = new org.bson.Document("$push", new org.bson.Document("postingList", new org.bson.Document()
                    .append("docId", url)
                    .append("termFrequency", postingInfo.getTermFrequency())));

            invertedIndexCollection.updateOne(query, update, new UpdateOptions().upsert(true));
        }
    }

    private void addToForwardIndex(MongoCollection<org.bson.Document> forwardIndexCollection, Map<String, Posting> titleFrequencyMap, Map<String, Posting> bodyFrequencyMap) {
        // push the data to forward index table
        for (Map.Entry<String, Posting> entry : titleFrequencyMap.entrySet()) { // push to the database
            String word = entry.getKey();
            Posting termInfo = entry.getValue();

            // Create or update the forward index document
            org.bson.Document query = new org.bson.Document("_id", url);
            org.bson.Document update = new org.bson.Document("$push", new org.bson.Document("postingList", new org.bson.Document()
                    .append("wordId", word)
                    .append("termFrequency", termInfo.getTermFrequency())));

            forwardIndexCollection.updateOne(query, update, new UpdateOptions().upsert(true));
        }
        for (Map.Entry<String, Posting> entry : bodyFrequencyMap.entrySet()) {
            String word = entry.getKey();
            Posting termInfo = entry.getValue();

            // Create or update the forward index document
            org.bson.Document query = new org.bson.Document("_id", url);
            org.bson.Document update = new org.bson.Document("$push", new org.bson.Document("postingList", new org.bson.Document()
                    .append("wordId", word)
                    .append("termFrequency", termInfo.getTermFrequency())));

            forwardIndexCollection.updateOne(query, update, new UpdateOptions().upsert(true));
        }

    }

    private Map<String, Posting> createCombineFrequencyMaps(Map<String, Posting> map1, Map<String, Posting> map2) {
        Map<String, Posting> combinedMap = new HashMap<>(map2);
        for (Map.Entry<String, Posting> entry : map1.entrySet()) {
            String word = entry.getKey();
            Posting posting = entry.getValue();
            Posting existingPosting = combinedMap.get(word);
            if (existingPosting == null) {
                combinedMap.put(word, posting);
            } else {
                existingPosting.incrementTermFrequency();
            }
        }
        return combinedMap;
    }

    public void extractWords() throws ParserException {
        Bson filter = eq("_id", url);
        org.bson.Document forwardIndexDoc = forwardTable.find(filter).first();
        if(forwardIndexDoc != null){
            System.out.println("Website update found");
            updatePage();
        }

        // Extract words and create frequency maps for title and body
        titleFrequencyMap = extractWordsAndCreateFrequencyMap(url, true);
        bodyFrequencyMap = extractWordsAndCreateFrequencyMap(url, false);
        // Add entries to the inverted index collection
        addToInvertedIndex(invertedTableTitle, titleFrequencyMap, true);
        addToInvertedIndex(invertedTableBody, bodyFrequencyMap, false);
        addToForwardIndex(forwardTable, titleFrequencyMap, bodyFrequencyMap);
        combinedFrequencyMap = createCombineFrequencyMaps(titleFrequencyMap, bodyFrequencyMap);

    }

    public void updatePage() throws ParserException{
        // 1. Find the forward index document for the given URL
        Bson filter = eq("_id", url);
        org.bson.Document forwardIndexDoc = forwardTable.find(filter).first();

        if (forwardIndexDoc != null) {
            // 2. Loop through the postingList and update the inverted indexes
            List<Document> postingList = (List<org.bson.Document>) forwardIndexDoc.get("postingList");
            for (org.bson.Document posting : postingList) {
                String wordId = posting.getString("wordId");

                // Update the invertedTableBody
                Bson filterWordID = eq("_id", wordId);
                org.bson.Document invertedBodyDoc = invertedTableBody.find(filterWordID).first();
                if (invertedBodyDoc != null) {
                    List<org.bson.Document> bodyPostingList = (List<org.bson.Document>) invertedBodyDoc.get("postingList");
                    bodyPostingList.removeIf(p -> p.getString("docId").equals(url));
                    invertedTableBody.updateOne(filterWordID, set("postingList", bodyPostingList));
                }

                // Update the invertedTableTitle
//                Bson titleFilter = eq("_id", wordId);
                org.bson.Document invertedTitleDoc = invertedTableTitle.find(filterWordID).first();
                if (invertedTitleDoc != null) {
                    List<org.bson.Document> titlePostingList = (List<org.bson.Document>) invertedTitleDoc.get("postingList");
                    titlePostingList.removeIf(p -> p.getString("docId").equals(url));
                    invertedTableTitle.updateOne(filterWordID, set("postingList", titlePostingList));
                }
            }

            // 3. Delete the forward index document
            forwardTable.deleteOne(filter);
        }
    }

    public static void main(String[] arg) {
        try {
            String testURL = "https://www.cse.ust.hk/~kwtleung/COMP4321/ust_cse/PG.htm";
            Indexer invertedIndex = new Indexer(testURL);
            System.out.println("Starting from main: ");
            invertedIndex.extractWords();
//            invertedIndex.updatePage();
        } catch (ParserException e) {
            System.err.println(e.toString());

        }
    }
}
